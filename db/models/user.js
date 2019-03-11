import mongoose from 'mongoose'
import consola from 'consola'
import axios from 'axios'
import * as Sentry from '@sentry/node'

const encodeQuery = queryObject => {
    return Object.keys(queryObject)
        .map(
            key =>
                encodeURIComponent(key) +
                '=' +
                encodeURIComponent(queryObject[key])
        )
        .join('&')
}

var Schema = mongoose.Schema

var UserSchema = new Schema({
    user_id: { type: String, index: true },
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    access_token: String,
    refresh_token: String,
    scope: [String]
})

UserSchema.query.byUserId = function(id) {
    return this.where({ user_id: new RegExp(id) })
}

UserSchema.statics.CreateUser = function(req_data, cb) {
    let user = req_data['user']
    if (!user) return
    let user_id = user['user_id']
    let user_data = {
        first_name: user['first_name'],
        last_name: user['last_name'],
        email: user['email'],
        gender: user['profile']['gender'],
        access_token: req_data['access_token'],
        refresh_token: req_data['refresh_token'],
        scope: req_data['scope']
    }
    this.findOneAndUpdate(
        { user_id: user_id },
        user_data,
        { upsert: true },
        function(err, instance) {
            if (cb) cb(instance)
        }
    )
}

UserSchema.methods.refreshToken = function(cb) {
    Sentry.configureScope(scope => {
        scope.setUser({
            id: this.user_id,
            username: this.first_name + ' ' + this.last_name,
            email: this.email,
            refresh_token: this.refresh_token,
            access_token: this.access_token,
            scope: this.scope
        })
    })
    Sentry.addBreadcrumb({
        category: 'token_refresh',
        message: 'Refreshing token',
        level: 'info'
    })
    var request = {
        method: 'post',
        url: process.env.SERVER_URL + '/o/token/',
        baseURL: false,
        data: encodeQuery({
            grant_type: 'refresh_token',
            refresh_token: this.refresh_token,
            client_id: process.env.CLIENT_ID
        })
    }
    return axios
        .request(request)
        .then(response => {
            Sentry.addBreadcrumb({
                category: 'token_refresh',
                message: 'Token refresh successful',
                level: 'info',
                data: response
            })
            this.set({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token
            })
            this.save(function(err, instance) {
                Sentry.addBreadcrumb({
                    category: 'user_edit',
                    message: 'Error saving the user',
                    level: 'error'
                })
                Sentry.captureException(err)
                if (!err && cb) return cb(instance)
                if (cb) return cb(null)
            })
        })
        .catch(error => {
            Sentry.addBreadcrumb({
                category: 'token_refresh',
                message: 'Error refreshing token',
                level: 'info'
            })
            Sentry.captureException(error)
            if (cb) return cb(null)
        })
}

UserSchema.methods.request = function(request) {
    Sentry.configureScope(scope => {
        scope.setUser({
            id: this.user_id,
            username: this.first_name + ' ' + this.last_name,
            email: this.email,
            refresh_token: this.refresh_token,
            access_token: this.access_token,
            scope: this.scope
        })
    })
    if (typeof request === 'string' || request instanceof String)
        request = { url: request, method: 'get' }
    if (request.headers) {
        request['headers']['Authorization'] = 'Bearer ' + this.access_token
    } else {
        request['headers'] = { Authorization: 'Bearer ' + this.access_token }
    }
    Sentry.addBreadcrumb({
        category: 'user_request',
        message: 'Performing request on behalf of user',
        level: 'info',
        data: request
    })
    return axios
        .request(request)
        .then(response => {
            Sentry.addBreadcrumb({
                category: 'user_request',
                message: 'User request successful',
                level: 'info',
                data: response
            })
            return response
        })
        .catch(error => {
            Sentry.addBreadcrumb({
                category: 'user_request',
                message: 'Error processing user request',
                level: 'error'
            })
            Sentry.captureException(error)
            if (error.response.status == 401) {
                this.refreshToken(instance => {
                    if (instance) return instance.request(request)
                    return Promise.reject(error.response)
                })
            } else {
                return Promise.reject(error.response)
            }
        })
}

UserSchema.methods.hasScopes = function(scopes) {
    if (typeof scopes === 'string' || scopes instanceof String)
        scopes = [scopes]
    let res = true
    scopes.forEach(scope => {
        res = res && this.scope.includes(scope)
    })
    return res
}

var User = mongoose.model('User', UserSchema)

export default User
