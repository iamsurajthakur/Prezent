import { getJobStatus, processPpt } from "@/controllers/process.controller";
import verifyJWT from "@/middlewares/auth.middlewares";
import { Router } from "express";

const router = Router()

router.post('/processDocs', verifyJWT, processPpt)
router.get('/getJobStatus/:jobId', verifyJWT, getJobStatus)

export default router