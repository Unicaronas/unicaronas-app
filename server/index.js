require('newrelic')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const Sentry = require('@sentry/node')
require('dotenv').config()
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: process.env.SENTRY_DSN })
    app.use(Sentry.Handlers.requestHandler())
    app.use(Sentry.Handlers.errorHandler())
}

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }

    // Give nuxt middleware to express
    app.use(nuxt.render)

    // Listen the server
    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}
start()
