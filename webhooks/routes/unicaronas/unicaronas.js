import { Router } from 'express'
import Handlers from './handlers'

const router = Router()

router.post('/unicaronas/', (req, res) => {
    let event = req.body['event']
    let payload = req.body['payload']
    try {
        console.log('receiving webhook request')
        console.log(event)
        console.log(payload)
        Handlers[event](payload, req)
        console.log('webhook processed')
        res.status(200)
        res.send()
    } catch (err) {
        console.log('error processing webhook request')
        console.log(err)
        res.status(400)
        res.send()
    }
})

export default router
