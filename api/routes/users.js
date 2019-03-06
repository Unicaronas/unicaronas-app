import * as Sentry from '@sentry/node'
import { Router } from 'express'
import User from '../../db/models/user.js'

const router = Router()

router.post('/users/update/', (req, res) => {
    try {
        User.CreateUser(req.body)
        res.status(200)
    } catch (err) {
        res.status(400)
        Sentry.captureException(err)
        console.log(err)
    }
    res.send()
})

export default router
