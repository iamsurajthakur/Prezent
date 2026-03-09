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

    const CHUNKS_PER_SLIDE = 3
    const mergedChunks: string[] = []
    for(let i = 0; i < chunks.length; i += CHUNKS_PER_SLIDE) {
        mergedChunks.push(chunks.slice(i, i + CHUNKS_PER_SLIDE).join(" "))
    }

    const slides: Slide[] = []

    for(let i = 0; i < mergedChunks.length; i++) {
        const prompt = i === 0
            ? firstChunkPrompt(mergedChunks[i])
            : subsequentChunkPrompt(mergedChunks[i])

        const completion = await hfClient.chat.completions.create({
            model: "meta-llama/Llama-3.1-8B-Instruct:novita",
            messages: [
                {
                    role: "system",
                    content: "You generate clean structured JSON presentation slides."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.2
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
                bullets: [mergedChunks[i].slice(0, 100) + "..."],
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