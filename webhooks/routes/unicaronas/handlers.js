import * as Sentry from '@sentry/node'
import User from '../../../db/models/user'
import { basicEmail, actionEmail } from '../../../mailing/mailer'
import * as utils from './utils'

/*
 * Passenger webhooks
 */

async function base_passenger(payload, req, func, action) {
    console.log('base passenger webhook handler')
    Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Sending ' + func + ' email',
        data: payload,
        level: 'info'
    })
    console.log('getting user, resource and scopes')
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:passenger:read']
    let trip
    // Get user from mongo
    console.log(user_id)
    console.log(resource_url)
    console.log('getting user from mongo')
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        console.log('user found')
        console.log(user)
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Got user. Getting trip',
            level: 'info'
        })
        Sentry.configureScope(scope => {
            scope.setUser({
                id: user.user_id,
                username: user.first_name + ' ' + user.last_name,
                email: user.email,
                refresh_token: user.refresh_token,
                access_token: user.access_token,
                scope: user.scope
            })
        })
        // Get the trip
        console.log('getting trip')
        trip = await user
            .request(resource_url)
            .then(response => {
                console.log('TRIP RESPONSE')
                console.log(response)
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Successfully recovered trip',
                    data: response,
                    level: 'info'
                })
                return response.data
            })
            .catch(error => {
                console.log('failed to recover trip')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Error while getting trip',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        // If the trip was found
        if (trip) {
            console.log('trip recovered')
            console.log(trip)
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got trip. Sending email',
                data: trip,
                level: 'info'
            })
            // Send email
            try {
                console.log('sending email')
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
            } catch (err) {
                console.log('failed to send email')
                Sentry.captureException(err)
            }
        } else {
            Sentry.captureMessage('Failed to get trip')
        }
    } else {
        Sentry.captureMessage('Failed to get user from Mongo')
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
    console.log('trip deleted webhook handler')
    Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Sending trip deleted email',
        data: payload,
        level: 'info'
    })
    // Passenger was removed from a trip
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = []
    console.log(user_id)
    console.log(resource_url)
    console.log('getting user')
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        console.log('user found')
        console.log(user)
        Sentry.configureScope(scope => {
            scope.setUser({
                id: user.user_id,
                username: user.first_name + ' ' + user.last_name,
                email: user.email,
                refresh_token: user.refresh_token,
                access_token: user.access_token,
                scope: user.scope
            })
        })
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Got user. Sending email',
            level: 'info'
        })
        try {
            console.log('sending email')
            // Send email
            payload['app_name'] = process.env.APP_NAME
            payload['user'] = user
            let data = utils.buildEmailData(payload, 'trip_deleted')
            data['to'] = user.email
            return basicEmail(data)
        } catch (err) {
            console.log('failed to send email')
            Sentry.captureException(err)
        }
    } else {
        Sentry.captureMessage('Failed to get user from Mongo')
    }
}

/*
 * Driver webhooks
 */

async function base_driver(payload, req, func) {
    console.log('base driver webhook handler')
    Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Sending ' + func + ' email',
        data: payload,
        level: 'info'
    })
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:driver:read']
    let passenger, trip
    console.log(user_id)
    console.log(resource_url)
    console.log('getting user')
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        console.log('user found')
        console.log(user)
        Sentry.configureScope(scope => {
            scope.setUser({
                id: user.user_id,
                username: user.first_name + ' ' + user.last_name,
                email: user.email,
                refresh_token: user.refresh_token,
                access_token: user.access_token,
                scope: user.scope
            })
        })
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Got user. Getting passenger',
            level: 'info'
        })
        // Get the trip
        passenger = await user
            .request(resource_url)
            .then(response => {
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Passenger recovered successfully',
                    data: response,
                    level: 'info'
                })
                return response.data
            })
            .catch(error => {
                console.log('failed to get passenger')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Error while getting passenger',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        if (passenger) {
            console.log('passenger recovered')
            console.log(passenger)
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got passenger. Getting trip',
                data: passenger,
                level: 'info'
            })
            console.log('getting trip')
            trip = await user
                .request(passenger.trip)
                .then(response => {
                    Sentry.addBreadcrumb({
                        category: 'webhook',
                        message: 'Trip recovered successfully',
                        data: response,
                        level: 'info'
                    })
                    return response.data
                })
                .catch(error => {
                    console.log('failed to get trip')
                    Sentry.addBreadcrumb({
                        category: 'webhook',
                        message: 'Error while getting trip',
                        level: 'error'
                    })
                    Sentry.captureException(error)
                    return null
                })
            // If the trip was found
            if (trip) {
                console.log('trip recovered')
                console.log(trip)
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Got trip. Sending email',
                    data: passenger,
                    level: 'info'
                })
                try {
                    console.log('sending email')
                    // Send email
                    trip['passenger'] = passenger
                    trip['app_name'] = process.env.APP_NAME
                    trip['user'] = user
                    let data = utils.buildEmailData(trip, func)
                    data['to'] = user.email
                    data['actionName'] = 'Ver carona'
                    data['actionUrl'] = utils.getTripUrl(req, true, trip.id)
                    return actionEmail(data)
                } catch (err) {
                    console.log('failed to send email')
                    Sentry.captureException(err)
                }
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
    console.log('passenger gave up webhook handler')
    Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Sending passenger give up email',
        data: payload,
        level: 'info'
    })
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:driver:read']
    let trip
    // Get user from mongo
    console.log(user_id)
    console.log(resource_url)
    console.log('getting user')
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        console.log('user found')
        console.log(user)
        Sentry.configureScope(scope => {
            scope.setUser({
                id: user.user_id,
                username: user.first_name + ' ' + user.last_name,
                email: user.email,
                refresh_token: user.refresh_token,
                access_token: user.access_token,
                scope: user.scope
            })
        })
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Got user. Getting trip',
            level: 'info'
        })
        // Get the trip
        console.log('getting trip')
        trip = await user
            .request(resource_url)
            .then(response => {
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Trip recovered successfully',
                    data: response,
                    level: 'info'
                })
                return response.data
            })
            .catch(error => {
                console.log('failed to get trip')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Error while getting trip',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        // If the trip was found
        if (trip) {
            console.log('trip recovered')
            console.log(trip)
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got trip. Sending email',
                data: trip,
                level: 'info'
            })
            try {
                console.log('sending email')
                // Send email
                trip['passenger'] = payload['passenger']
                trip['app_name'] = process.env.APP_NAME
                trip['user'] = user
                let data = utils.buildEmailData(
                    trip,
                    'driver_passenger_give_up'
                )
                data['to'] = user.email
                data['actionName'] = 'Ver carona'
                data['actionUrl'] = utils.getTripUrl(req, true, trip.id)
                return actionEmail(data)
            } catch (err) {
                console.log('failed to send email')
                Sentry.captureException(err)
            }
        }
        // Else, return withou sending email
        console.log('Failed to send email', user, trip)
    }
}

async function alarm_dispatched(payload, req) {
    console.log('alarm dispatched webhook handler')
    Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Sending alarm dispatched email',
        data: payload,
        level: 'info'
    })
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:read']
    console.log(user_id)
    console.log(resource_url)
    console.log('getting user')
    let trip
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        console.log('user recovered')
        console.log(user)
        Sentry.configureScope(scope => {
            scope.setUser({
                id: user.user_id,
                username: user.first_name + ' ' + user.last_name,
                email: user.email,
                refresh_token: user.refresh_token,
                access_token: user.access_token,
                scope: user.scope
            })
        })
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Got user. Getting trip',
            level: 'info'
        })
        // Get the trip
        console.log('getting trip')
        trip = await user
            .request(resource_url)
            .then(response => {
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Trip recovered successfully',
                    data: response,
                    level: 'info'
                })
                return response.data
            })
            .catch(error => {
                console.log('failed to get trip')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Error while getting trip',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        // If the trip was found
        if (trip) {
            console.log('trip recovered')
            console.log(trip)
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got trip. Sending email',
                data: trip,
                level: 'info'
            })
            try {
                console.log('send email')
                // Send email
                trip['app_name'] = process.env.APP_NAME
                trip['user'] = user
                let data = utils.buildEmailData(trip, 'alarm_dispatched')
                data['to'] = user.email
                data['actionName'] = 'Reserve sua vaga'
                data['actionUrl'] = utils.getSearchUrl(req, trip.id)
                return actionEmail(data)
            } catch (err) {
                console.log('failed to send email')
                Sentry.captureException(error)
            }
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
