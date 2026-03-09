import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import {type Response, type Request } from "express";
import { hfClient } from "@/utils/hfClient";
import { firstChunkPrompt, subsequentChunkPrompt } from "@/utils/promptTemplate";

interface Slide {
    title: string
    bullets: string[]
}

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

    const slides: Slide[] = []

    for(let i = 0; i < chunks.length; i++) {
        const prompt = i === 0
            ? firstChunkPrompt(chunks[i])
            : subsequentChunkPrompt(chunks[i])

        const completion = await hfClient.chat.completions.create({
            model: "HuggingFaceH4/zephyr-7b-beta:featherless-ai",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        }).catch((err: any) => {
            console.log("HF ERROR STATUS:", err.status)
            console.log("HF ERROR MESSAGE:", err.message)
            console.log("HF ERROR BODY:", err.error)
            throw err
        })

        const rawJson = completion.choices[0].message.content

        if(!rawJson) {
            throw new ApiError(502, `Empty response from LLM for chunk ${i}`)
        }

        const cleaned = rawJson.replace(/```json|```/g, "").trim()

        try {
            const parsed = JSON.parse(cleaned)

            if(parsed.slides && Array.isArray(parsed.slides)) {
                slides.push(...parsed.slides)
            }
        } catch {
            // Fallback slide instead of crashing the entire job
            slides.push({
                title: `Section ${i + 1}`,
                bullets: [chunks[i].slice(0, 100) + "..."],
            })
        }
    }

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