import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import {type Request, type Response } from "express";
import { updateStats } from "@/utils/updateStats";

const trackExport = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id

    if(!userId) {
        throw new ApiError(404,'user not found')
    }

    await updateStats(userId.toString(), { totalExports: 1 })

    return res.status(200).json(new ApiResponse(
        200,
        {},
        'Export tracked'
    ))

})

export {
    trackExport
}