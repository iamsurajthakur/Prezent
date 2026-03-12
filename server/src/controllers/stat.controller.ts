import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import {type Request, type Response } from "express";
import { updateStats } from "@/utils/updateStats";
import { Stat } from "@/models/stats.models";

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

const getStats = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404,'user not found')
    }

    const stats = await Stat.findOne({ userId })

    return res.status(200).json(new ApiResponse(
        200,
        {
            presentationGenerated: stats?.presentationGenerated ?? 0,
            slidesGenerated: stats?.slidesGenerated ?? 0,
            docsUploaded: stats?.docsUploaded ?? 0,
            totalExports: stats?.totalExports ?? 0,
            aiGenerations: stats?.aiGenerations ?? 0,
            lastActivity: stats?.lastActivity ?? null,
            weeklyActivity: stats?.weeklyActivity ?? [],
        },
        'Stats fetched'
    ))
})

export {
    trackExport,
    getStats
}