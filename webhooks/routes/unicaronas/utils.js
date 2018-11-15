import fs from 'fs'
import mustache from 'mustache'
import moment from 'moment-timezone'
moment.tz.setDefault('America/Sao_Paulo')
moment.locale('pt-br')

import User from '../../../db/models/user'
import universityMap from '../../../plugins/universityMap'

async function userHasScopes(user_id, scopes) {
    let user = await User.findOne()
        .byUserId(user_id)
        .then(obj => {
            return obj
        })
        .catch(error => {
            return null
        })
    if (user !== null) {
        // Check if it has the passenger read permission to read
        // info about the trip
        if (user.hasScopes(scopes)) {
            return user
        }
    }
    return null
}

function getTripUrl(req, isDriver, trip_id) {
    let path
    if (isDriver) path = 'driver'
    else path = 'passenger'
    return (
        req.protocol +
        '://' +
        req.get('host') +
        '/trips/' +
        path +
        '/' +
        trip_id
    )
}

function getSearchUrl(req, trip_id) {
    return req.protocol + '://' + req.get('host') + '/search/' + trip_id
}

function buildEmailData(payload, parent) {
    let dataList = ['subject', 'title', 'subtitle', 'description']
    payload['toCalendar'] = function() {
        return function(date, render) {
            let rdate = render(date)
            return render(moment(rdate).calendar())
        }
    }
    payload['locationLink'] = function() {
        return function(raw, render) {
            let loc = raw
                .substring(raw.lastIndexOf('{') + 1, raw.lastIndexOf('}}'))
                .trim()
            let lat = render('{{' + loc + '_coordinates.latitude}}')
            let long = render('{{' + loc + '_coordinates.longitude}}')
            let loc_name = render(raw)
                .split('-')[0]
                .trim()
            let url = 'https://www.google.com/maps/place/' + lat + ',' + long
            return '<a href="' + url + '">' + loc_name + '</a>'
        }
    }
    payload['locationTrim'] = function() {
        return function(raw, render) {
            let loc_name = render(raw)
                .split('-')[0]
                .trim()
            return loc_name
        }
    }
    payload['genderNoun'] = function() {
        return function(gender, render) {
            let map = {
                male: 'o',
                female: 'a',
                other: 'x',
                na: 'x'
            }
            return map[render(gender)]
        }
    }
    payload['genderNoun2'] = function() {
        return function(gender, render) {
            let map = {
                male: 'e',
                female: 'a',
                other: 'x',
                na: 'x'
            }
            return map[render(gender)]
        }
    }
    payload['js'] = function() {
        return function(expression, render) {
            return eval(render(expression))
        }
    }
    payload['capitalize'] = function() {
        return function(text, render) {
            text = render(text)
            return text.charAt(0).toUpperCase() + text.slice(1)
        }
    }
    payload['universityMap'] = function() {
        return function(text, render) {
            text = render(text)
            return universityMap(text)
        }
    }
    let data = {}
    dataList.forEach(name => {
        let p = __dirname + '/email_messages/' + parent + '/' + name + '.txt'
        if (fs.existsSync(p)) {
            data[name] = mustache.render(fs.readFileSync(p, 'utf8'), payload)
        }
    })
    return data
}

function buildErrorMessage(error) {
    let response = error.response
    let request = error.request
    let err = {
        response: {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        },
        request: {
            url: request.url,
            method: request.method,
            baseUrl: request.baseUrl,
            data: request.data,
            params: request.params
        }
    }
    return err
}

export {
    userHasScopes,
    getTripUrl,
    getSearchUrl,
    buildEmailData,
    buildErrorMessage
}
