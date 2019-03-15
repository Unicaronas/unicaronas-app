import * as Sentry from '@sentry/node'
import consola from 'consola'
import User from '../../../db/models/user'
import { basicEmail, actionEmail } from '../../../mailing/mailer'
import * as utils from './utils'

/*
 * Passenger webhooks
 */

async function base_passenger(payload, req, func, action) {
    consola.trace('base passenger webhook handler')
    Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Sending ' + func + ' email',
        data: payload,
        level: 'info'
    })
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:passenger:read']
    let trip
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        consola.debug('User found')
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Got user. Getting trip',
            level: 'debug'
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
        trip = await user
            .request(resource_url)
            .then(response => {
                consola.trace('Trip data returned')
                if (response) {
                    consola.success('Trip data is valid')
                    Sentry.addBreadcrumb({
                        category: 'webhook',
                        message: 'Successfully recovered trip',
                        data: response,
                        level: 'info'
                    })
                    return response.data
                } else {
                    consola.error('Trip data returned empty')
                    Sentry.captureMessage('Trip data returned empty')
                    return null
                }
            })
            .catch(error => {
                consola.error('Failed to recover trip data')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Failed to recover trip data',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        // If the trip was found
        if (trip) {
            consola.debug('Trip recovered')
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got trip. Sending email',
                data: trip,
                level: 'debug'
            })
            // Send email
            try {
                consola.trace('Sending email')
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
                consola.error('Failed to send email')
                Sentry.captureException(err)
            }
        }
    } else {
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Failed to get user from Mongo',
            level: 'error'
        })
        consola.error('Failed to get user from Mongo')
    }
    // Else, return withou sending email
    consola.error('Failed to send email')
    Sentry.captureMessage('Failed to send email')
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
    consola.trace('trip deleted webhook handler')
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
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        consola.debug('User found')
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Got user. Sending email',
            level: 'debug'
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
        try {
            consola.trace('Sending email')
            // Send email
            payload['app_name'] = process.env.APP_NAME
            payload['user'] = user
            let data = utils.buildEmailData(payload, 'trip_deleted')
            data['to'] = user.email
            return basicEmail(data)
        } catch (err) {
            consola.error('Failed to send email')
            Sentry.captureException(err)
        }
    } else {
        Sentry.addBreadcrumb({
            category: 'webhook',
            message: 'Failed to get user from Mongo',
            level: 'error'
        })
        consola.error('Failed to get user from Mongo')
    }
    // Else, return withou sending email
    consola.error('Failed to send email')
    Sentry.captureMessage('Failed to send email')
}

/*
 * Driver webhooks
 */

async function base_driver(payload, req, func) {
    consola.trace('base driver webhook handler')
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
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        consola.debug('user found')
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
            level: 'debug'
        })
        // Get the passenger
        passenger = await user
            .request(resource_url)
            .then(response => {
                consola.success('Passenger recovered successfully')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Passenger recovered successfully',
                    data: response,
                    level: 'info'
                })
                return response.data
            })
            .catch(error => {
                consola.error('Failed to get passenger')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Error while getting passenger',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        if (passenger) {
            consola.debug('Passenger recovered. Getting trip')
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got passenger. Getting trip',
                data: passenger,
                level: 'debug'
            })
            trip = await user
                .request(passenger.trip)
                .then(response => {
                    consola.trace('Trip data returned')
                    if (response) {
                        consola.success('Trip data is valid')
                        Sentry.addBreadcrumb({
                            category: 'webhook',
                            message: 'Successfully recovered trip',
                            data: response,
                            level: 'info'
                        })
                        return response.data
                    } else {
                        consola.error('Trip data returned empty')
                        Sentry.captureMessage('Trip data returned empty')
                        return null
                    }
                })
                .catch(error => {
                    consola.error('Failed to recover trip data')
                    Sentry.addBreadcrumb({
                        category: 'webhook',
                        message: 'Failed to recover trip data',
                        level: 'error'
                    })
                    Sentry.captureException(error)
                    return null
                })
            // If the trip was found
            if (trip) {
                consola.debug('Trip recovered')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Got trip. Sending email',
                    data: trip,
                    level: 'debug'
                })
                try {
                    consola.trace('Sending email')
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
                    consola.error('Failed to send email')
                    Sentry.captureException(err)
                }
            }
        }
    }
    // Else, return withou sending email
    consola.error('Failed to send email')
    Sentry.captureMessage('Failed to send email')
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
    consola.trace('passenger gave up webhook handler')
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
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        consola.debug('User found. Getting trip')
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
            level: 'debug'
        })
        // Get the trip
        trip = await user
            .request(resource_url)
            .then(response => {
                consola.trace('Trip data returned')
                if (response) {
                    consola.success('Trip data is valid')
                    Sentry.addBreadcrumb({
                        category: 'webhook',
                        message: 'Successfully recovered trip',
                        data: response,
                        level: 'info'
                    })
                    return response.data
                } else {
                    consola.error('Trip data returned empty')
                    Sentry.captureMessage('Trip data returned empty')
                    return null
                }
            })
            .catch(error => {
                consola.error('Failed to recover trip data')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Failed to recover trip data',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        // If the trip was found
        if (trip) {
            consola.debug('Trip recovered')
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got trip. Sending email',
                data: trip,
                level: 'debug'
            })
            try {
                consola.trace('Sending email')
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
                consola.error('Failed to send email')
                Sentry.captureException(err)
            }
        }
        // Else, return withou sending email
        consola.error('Failed to send email')
        Sentry.captureMessage('Failed to send email')
    }
}

async function alarm_dispatched(payload, req) {
    consola.trace('alarm dispatched webhook handler')
    Sentry.addBreadcrumb({
        category: 'webhook',
        message: 'Sending alarm dispatched email',
        data: payload,
        level: 'info'
    })
    let user_id = payload['user_id']
    let resource_url = payload['resource_url']
    let required_scopes = ['trips:read']
    let trip
    // Get user from mongo
    let user = await utils.userHasScopes(user_id, required_scopes)
    // If user is found
    if (user) {
        consola.debug('User recovered. Getting trip')
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
            level: 'debug'
        })
        // Get the trip
        trip = await user
            .request(resource_url)
            .then(response => {
                consola.trace('Trip data returned')
                if (response) {
                    consola.success('Trip data is valid')
                    Sentry.addBreadcrumb({
                        category: 'webhook',
                        message: 'Successfully recovered trip',
                        data: response,
                        level: 'info'
                    })
                    return response.data
                } else {
                    consola.error('Trip data returned empty')
                    Sentry.captureMessage('Trip data returned empty')
                    return null
                }
            })
            .catch(error => {
                consola.error('Failed to recover trip data')
                Sentry.addBreadcrumb({
                    category: 'webhook',
                    message: 'Failed to recover trip data',
                    level: 'error'
                })
                Sentry.captureException(error)
                return null
            })
        // If the trip was found
        if (trip) {
            consola.debug('Trip recovered')
            Sentry.addBreadcrumb({
                category: 'webhook',
                message: 'Got trip. Sending email',
                data: trip,
                level: 'debug'
            })
            try {
                consola.trace('Send email')
                // Send email
                trip['app_name'] = process.env.APP_NAME
                trip['user'] = user
                let data = utils.buildEmailData(trip, 'alarm_dispatched')
                data['to'] = user.email
                data['actionName'] = 'Reserve sua vaga'
                data['actionUrl'] = utils.getSearchUrl(req, trip.id)
                return actionEmail(data)
            } catch (err) {
                consola.error('Failed to send email')
                Sentry.captureException(error)
            }
        }
        // Else, return withou sending email
        consola.error('Failed to send email')
        Sentry.captureMessage('Failed to send email')
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
