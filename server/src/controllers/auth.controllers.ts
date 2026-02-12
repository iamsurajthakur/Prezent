import asyncHandler from "@/utils/asyncHandler";
import {type Request, type Response } from "express";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    return res.send('register route')
})

export {
    registerUser,
}