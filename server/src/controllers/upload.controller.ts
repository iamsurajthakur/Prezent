import asyncHandler from "@/utils/asyncHandler";
import {type Request, type Response } from "express";
import { supabase } from "@/utils/supabase";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import { ALLOWED_TYPES } from "@/constant";
import { Job } from "@/models/job.models";

const BUCKET_NAME = 'uploads'
const SIGNED_URL_TTL = 10 * 60

const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    if(!req.file){
        throw new ApiError(400, 'No file uploaded')
    }

    const { buffer, mimetype, originalname, size } = req.file
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404,'User not found.')
    }

    const extenstion = ALLOWED_TYPES[mimetype]

    if(!extenstion){
        throw new ApiError(400,'Unsupported file type')
    }
    
    const originalNameWithoutExt = originalname.replace(/\.[^/.]+$/, "")

    const storagePath = `${userId}/${originalNameWithoutExt}-${Date.now()}${extenstion}`

    const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
        contentType: mimetype,
        upsert: false,
    })

    if(uploadError){
        throw new ApiError(502, `Upload failed: ${uploadError.message}`)
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, SIGNED_URL_TTL)

    const job = await Job.create({ status: 'pending' })

    if(signedUrlError || !signedUrlData?.signedUrl){
        throw new ApiError(502, 'File stored but failed to generate access URL.')
    }

    if(!job){
        throw new ApiError(404,'job not found')
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                signedUrl: signedUrlData.signedUrl,
                jobId: job._id,
                userId,
                expiresInSeconds: SIGNED_URL_TTL,
                file: {
                originalName: originalname,
                mimeType: mimetype,
                sizeBytes: size,
                storagePath,
                },
            },
            'File uploaded successfully'
        )
    )
})

export {
    uploadFile,
}