import { firstChunkPrompt, subsequentChunkPrompt } from "@/utils/promptTemplate"
import { hfClient } from "@/utils/hfClient"

interface Slide {
    title: string
    bullets: string[]
}

export const getSlideJsonInternal = async (chunks: string[]): Promise<Slide[]> => {
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
                { role: "system", content: "You generate clean structured JSON presentation slides." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.2
        })

        const rawJson = completion.choices[0].message.content
        if(!rawJson) continue

        const cleaned = rawJson.replace(/```json|```/g, "").trim()

        try {
            const parsed = JSON.parse(cleaned)
            if(parsed.slides && Array.isArray(parsed.slides)) {
                const validSlides = parsed.slides.filter(
                    (s: any) => s.title && Array.isArray(s.bullets)
                )
                slides.push(...validSlides)
            }
        } catch {
            slides.push({
                title: `Section ${i + 1}`,
                bullets: [mergedChunks[i].slice(0, 100) + "..."],
            })
        }
    }

    return slides
}