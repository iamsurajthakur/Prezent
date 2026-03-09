import { getSlideJson } from "@/controllers/slide.controller";
import verifyJWT from "@/middlewares/auth.middlewares";
import { Router } from "express";

const router = Router()

router.post('/getSlideJson',verifyJWT, getSlideJson)

export default router