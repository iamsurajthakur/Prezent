import { Router } from "express";
import { registerUser, loginUser, getMe, refreshAccessToken, logout } from '@controllers/auth.controllers'
import verifyJWT from "@/middlewares/auth.middlewares";

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/getMe', getMe)
router.post('/refreshToken', refreshAccessToken)

// Protected route
router.post('/logout', verifyJWT, logout)

export default router