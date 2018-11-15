import { Router } from 'express'
import User from '../../db/models/user.js'

const router = Router()

router.post('/users/update/', (req, res) => {
    User.CreateUser(req.body)
})

export default router
