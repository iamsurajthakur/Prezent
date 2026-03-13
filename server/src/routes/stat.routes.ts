import { getRecentActivity, getRecentPresentation, getStats, getUserInfo, trackExport } from "@/controllers/stat.controller";
import verifyJWT from "@/middlewares/auth.middlewares";
import { Router } from "express";

const router = Router()

router.post('/export', verifyJWT, trackExport)
router.get('/getStats', verifyJWT, getStats)
router.get('/getRecentPresentations', verifyJWT, getRecentPresentation)
router.get('/getRecentActivity', verifyJWT, getRecentActivity)
router.get('/getUserInfo', verifyJWT, getUserInfo)

export default router