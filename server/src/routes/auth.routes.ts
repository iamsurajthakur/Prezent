import { Router } from "express";
import { registerUser, loginUser, getMe } from '@controllers/auth.controllers'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getMe', getMe)

export default router