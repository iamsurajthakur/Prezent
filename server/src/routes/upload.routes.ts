import { Router } from "express";
import verifyJWT from "@/middlewares/auth.middlewares";
import { upload } from "@/middlewares/upload.middlewares";
import { uploadFile } from "@/controllers/upload.controller";

const router = Router()

router.post('/uploadFile', verifyJWT, upload.single('userDocs'), uploadFile)

export default router