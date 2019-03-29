import fs from 'fs'
import mustache from 'mustache'
import moment from 'moment-timezone'
moment.tz.setDefault('America/Sao_Paulo')
moment.locale('pt-br')
import * as Sentry from '@sentry/node'
import consola from 'consola'

import User from '../../../db/models/user'
import universityMap from '../../../plugins/universityMap'

async function userHasScopes(user_id, scopes) {
    consola.trace('Getting user with scopes')
    let user = await User.findOne()
        .byUserId(user_id)
        .then(obj => {
            Sentry.addBreadcrumb({
                category: 'user',
                message: 'User recovered',
                level: 'info',
                data: obj
            })
            consola.trace('User recovered')
            return obj
        })
        .catch(error => {
            consola.error('Failed to recover user')
            Sentry.addBreadcrumb({
                category: 'user',
                message: 'Failed to recover user',
                level: 'error'
            })
            Sentry.captureException(err)
            return null
        })
    if (user !== null) {
        consola.trace('Checking user scopes')
        if (user.hasScopes(scopes)) {
            consola.trace('User has the required scopes')
            Sentry.addBreadcrumb({
                category: 'user',
                message: 'User has the required scopes',
                level: 'info'
            })
            return user
        }
    }
    consola.debug(
        'User is null or does not have the necessary scopes. Returning null'
    )
    return null
}

function getTripUrl(req, isDriver, trip_id) {
    consola.trace('Getting trip url')
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
    consola.trace('Getting search url')
    return req.protocol + '://' + req.get('host') + '/search/' + trip_id
}

function buildEmailData(payload, parent) {
    consola.trace('Building email data')
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

function byteCount(s) {
    return encodeURI(s).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1
}

export { userHasScopes, getTripUrl, getSearchUrl, buildEmailData }
