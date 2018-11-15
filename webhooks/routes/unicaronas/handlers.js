import User from '../../../db/models/user'
import { basicEmail, actionEmail } from '../../../mailing/mailer'
import * as utils from './utils'

/*
 * Passenger webhooks
 */

async function base_passenger(payload, req, func, action) {
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:passenger:read']
    let trip
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        // Get the trip
        trip = await user
            .request(resource_url)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return null
            })
        // If the trip was found
        if (trip) {
            // Send email
            trip['app_name'] = process.env.APP_NAME
            trip['user'] = user
            let data = utils.buildEmailData(trip, func)
            data['to'] = user.email
            if (action) {
                data['actionName'] = 'Ver carona'
                data['actionUrl'] = utils.getTripUrl(req, false, trip.id)
                return actionEmail(data)
            } else {
                return basicEmail(data)
            }
        }
    }
    // Else, return withou sending email
    console.log('Failed to send email', user, trip)
}

function passenger_pending(payload, req) {
    // Passenger is pending
    base_passenger(payload, req, 'passenger_pending', true)
}

function passenger_approved(payload, req) {
    // Passenger was approved
    base_passenger(payload, req, 'passenger_approved', true)
}

function passenger_denied(payload, req) {
    // Passenger was denied
    base_passenger(payload, req, 'passenger_denied', false)
}

function passenger_forfeit(payload, req) {
    // Passenger was removed from a trip
    base_passenger(payload, req, 'passenger_forfeit', false)
}

async function trip_deleted(payload, req) {
    // Passenger was removed from a trip
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = []
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        // Send email
        payload['app_name'] = process.env.APP_NAME
        payload['user'] = user
        let data = utils.buildEmailData(payload, 'trip_deleted')
        data['to'] = user.email
        return basicEmail(data)
    }
}

/*
 * Driver webhooks
 */

async function base_driver(payload, req, func) {
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:driver:read']
    let passenger, trip
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        // Get the trip
        passenger = await user
            .request(resource_url)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return null
            })
        if (passenger) {
            trip = await user
                .request(passenger.trip)
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    return null
                })
            // If the trip was found
            if (trip) {
                // Send email
                trip['passenger'] = passenger
                trip['app_name'] = process.env.APP_NAME
                trip['user'] = user
                let data = utils.buildEmailData(trip, func)
                data['to'] = user.email
                data['actionName'] = 'Ver carona'
                data['actionUrl'] = utils.getTripUrl(req, true, trip.id)
                return actionEmail(data)
            }
        }
    }
    // Else, return withou sending email
    console.log('Failed to send email', user, trip)
}

function driver_passenger_pending(payload, req) {
    // Passenger is pending on a trip was removed from a trip
    base_driver(payload, req, 'driver_passenger_pending')
}

function driver_passenger_approved(payload, req) {
    // Passenger is pending on a trip was removed from a trip
    base_driver(payload, req, 'driver_passenger_approved')
}

async function driver_passenger_give_up(payload, req) {
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:driver:read']
    let trip
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        // Get the trip
        trip = await user
            .request(resource_url)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return null
            })
        // If the trip was found
        if (trip) {
            // Send email
            trip['passenger'] = payload['passenger']
            trip['app_name'] = process.env.APP_NAME
            trip['user'] = user
            let data = utils.buildEmailData(trip, 'driver_passenger_give_up')
            data['to'] = user.email
            data['actionName'] = 'Ver carona'
            data['actionUrl'] = utils.getTripUrl(req, true, trip.id)
            return actionEmail(data)
        }
        // Else, return withou sending email
        console.log('Failed to send email', user, trip)
    }
}

async function alarm_dispatched(payload, req) {
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:read']
    let trip
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        // Get the trip
        trip = await user
            .request(resource_url)
            .then(response => {
                return response.data
            })
            .catch(error => {
                return null
            })
        // If the trip was found
        if (trip) {
            // Send email
            trip['app_name'] = process.env.APP_NAME
            trip['user'] = user
            let data = utils.buildEmailData(trip, 'alarm_dispatched')
            data['to'] = user.email
            data['actionName'] = 'Reserve sua vaga'
            data['actionUrl'] = utils.getSearchUrl(req, trip.id)
            return actionEmail(data)
        }
        // Else, return withou sending email
        console.log('Failed to send email', user, trip)
    }
}

// Export handlers
export default {
    // Passenger webhooks
    passenger_pending: passenger_pending,
    passenger_approved: passenger_approved,
    passenger_denied: passenger_denied,
    passenger_forfeit: passenger_forfeit,
    trip_deleted: trip_deleted,
    driver_passenger_pending: driver_passenger_pending,
    driver_passenger_approved: driver_passenger_approved,
    driver_passenger_give_up: driver_passenger_give_up,
    alarm_dispatched: alarm_dispatched
}
