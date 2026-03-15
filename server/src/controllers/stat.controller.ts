import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import {type Request, type Response } from "express";
import { updateStats } from "@/utils/updateStats";
import { Stat } from "@/models/stats.models";
import { Presentation } from "@/models/presentation.models";
import { Activity } from "@/models/activity.models";
import { User } from "@/models/user.models";

const formatRelativeTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return "Yesterday"
}

const trackExport = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id
    const { presentationName } = req.body

    if(!userId) {
        throw new ApiError(404,'user not found')
    }

    await updateStats(userId.toString(), { totalExports: 1 })

    await Activity.create({
        userId,
        type: 'export',
        label: 'exported',
        subject: presentationName ?? 'Presentation',
        context: '.pptx'
    })

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

const getRecentPresentation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404,'User not found')
    }

    const presentations = await Presentation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name slides createdAt outputUrl')

    const formatted = presentations.map(p => ({
        id: p._id,
        name: p.name,
        slides: p.slides,
        outputUrl: p.outputUrl,
        date: new Date(p.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
        })
    }))

    return res.status(200).json(new ApiResponse(
        200,
        {presentations: formatted},
        'Presentations fetched'
    ))
})

const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404,'User not found')
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const activities = await Activity.find({
        userId,
        createdAt: { $gte: since}
    })
    .sort({ createdAt: -1})
    .limit(10)

    const formatted = activities.map(a => ({
        id: a._id,
        type: a.type,
        label: a.label,
        subject: a.subject,
        context: a.context ?? null,
        time: formatRelativeTime(a.createdAt.toISOString()),
    }))

    return res.status(200).json(new ApiResponse(
        200,
        { activities: formatted},
        'Activity fetched'
    ))

})

const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404,'User not found')
    }

    const userData = await User.findById(userId).select('fullName email')

    res.status(200).json(new ApiResponse(
        200,
        userData,
        'User info fetched'
    ))
})

const getPresentation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id

    const presentation = await Presentation.find({ userId }).sort({ updatedAt: -1 })

    if(!userId){
        throw new ApiError(404,'User not found.')
    }

    res.status(200).json(new ApiResponse(
        200,
        presentation,
        'Presentation fetched successfully.'
    ))

})

export {
    trackExport,
    getStats,
    getRecentPresentation,
    getRecentActivity,
    getUserInfo,
    getPresentation
}