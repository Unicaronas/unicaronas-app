import { Router } from 'express'
import Handlers from './handlers'

const router = Router()

router.post('/unicaronas/', (req, res) => {
    let event = req.body['event']
    let payload = req.body['payload']
    try {
        Handlers[event](payload, req)
        res.status(200)
        res.send()
    } catch (err) {
        res.status(400)
        res.send()
    }
})

export default router
