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

router.get('/users/get/auth/', (req, res) => {
    try {
        let data = User.findOne().byUserId(req.query.user_id).then(user => {
            res.json({
                access_token: user.access_token,
                refresh_token: user.refresh_token
            })
            res.status(200)
            res.send()
        }).catch(err => {
            res.status(404)
            res.send()
        })
    } catch (err) {
        res.status(400)
        Sentry.captureException(err)
        console.log(err)
        res.send()
    }
})

export default router
