import { Router } from "express";
import { registerUser, loginUser, getMe, refreshAccessToken } from '@controllers/auth.controllers'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getMe', getMe)
router.post('/refreshToken', refreshAccessToken)

export default router