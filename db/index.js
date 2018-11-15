import mongoose from 'mongoose'
import consola from 'consola'

mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true
    }
)

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise

//Get the default connection
var db = mongoose.connection

//Bind connection to error event (to get notification of connection errors)
db.on('error', consola.error.bind(consola, 'MongoDB connection error:'))
db.on(
    'connected',
    consola.success.bind(
        consola,
        'MongoDB connected to ' + process.env.MONGODB_URI
    )
)

export default db
