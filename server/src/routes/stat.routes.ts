import { getStats, trackExport } from "@/controllers/stat.controller";
import verifyJWT from "@/middlewares/auth.middlewares";
import { Router } from "express";

const router = Router()

router.post('/export', verifyJWT, trackExport)
router.get('/getStats', verifyJWT, getStats)

export default router