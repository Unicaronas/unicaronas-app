import mongoose from 'mongoose'
import consola from 'consola'
import axios from 'axios'

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
    console.log('REFRESHING TOKEN')
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
            console.log('GOT REFRESH TOKEN RESPONSE')
            console.log(response)
            this.set({
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token
            })
            this.save(function(err, instance) {
                if (!err && cb) return cb(instance)
                if (cb) return cb(null)
            })
        })
        .catch(error => {
            console.log('GOT ERROR REFRESHING TOKEN')
            console.log(error.response)
            if (cb) return cb(null)
        })
}

UserSchema.methods.request = function(request) {
    console.log('CALLING REQUEST ON')
    console.log(request)
    if (typeof request === 'string' || request instanceof String)
        request = { url: request, method: 'get' }
    if (request.headers) {
        request['headers']['Authorization'] = 'Bearer ' + this.access_token
    } else {
        request['headers'] = { Authorization: 'Bearer ' + this.access_token }
    }
    console.log('FORMATTED REQUEST')
    console.log(request)
    console.log('CALLING AXIOS')
    return axios
        .request(request)
        .then(response => {
            console.log('AXIOS RESPONSE')
            console.log(response)
            return response
        })
        .catch(error => {
            console.log('AXIOS GOT AN ERROR')
            console.log(error.response)
            if (error.response.status == 401) {
                console.log('ERROR 401. REFRESHING TOKEN')
                this.refreshToken(instance => {
                    console.log('INSTANCE')
                    console.log(instance)
                    if (instance) return instance.request(request)
                    console.log('NO INSTANCE. RETURNING ERROR PROMISE')
                    return Promise.reject(error.response)
                })
            } else {
                console.log('ERROR IS NOT 401')
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
