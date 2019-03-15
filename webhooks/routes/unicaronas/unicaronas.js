import consola from 'consola'
import * as Sentry from '@sentry/node'
import { Router } from 'express'
import Handlers from './handlers'

const router = Router()

router.post('/unicaronas/', (req, res) => {
    let event = req.body['event']
    let payload = req.body['payload']
    try {
        consola.info('Receiving webhook request')
        consola.info(event)
        consola.info(payload)
        Handlers[event](payload, req)
        res.status(200)
        res.send()
    } catch (err) {
        consola.error('Error processing webhook request')
        Sentry.captureException(err)
        res.status(400)
        res.send()
    }
})

export default router
