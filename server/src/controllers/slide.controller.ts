import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import {type Response, type Request } from "express";
import { getSlideJsonInternal } from "@/services/slide.service";

const getSlideJson = asyncHandler(async (req: Request, res: Response) => {

    const { chunks } = req.body
    console.log(chunks)
    const userId = req.user?._id
    console.log(userId)

    if(!userId) {
        throw new ApiError(404,'UserId not found')
    }

    if(!chunks || !Array.isArray(chunks) || chunks.length === 0) {
        throw new ApiError(400, 'No texts chunks provided')
    }

    const slides = await getSlideJsonInternal(chunks)

    if(slides.length === 0) {
        throw new ApiError(502, 'Failed to generate slides from provided chunks')
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            { slides, totalSlides: slides.length },
            'Slides generated successfully'
        )
    )
})

export {
    getSlideJson
}