import express from 'express'
import bodyParser from 'body-parser'
import users from './routes/users'

// Create express instnace
const app = express()

// Configure POST support
app.use(bodyParser.json())

// Import Webhook Routes
app.use(users)

// Export the server middleware
export default {
    path: '/api',
    handler: app
}
