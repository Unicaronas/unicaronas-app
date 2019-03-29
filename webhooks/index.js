import express from 'express'
import bodyParser from 'body-parser'
import unicaronas from './routes/unicaronas/unicaronas'

// Create express instnace
const app = express()

// Configure POST support
app.use(bodyParser.json())

// Import Webhook Routes
app.use(unicaronas)

// Export the server middleware
export default {
    path: '/webhooks',
    handler: app
}
