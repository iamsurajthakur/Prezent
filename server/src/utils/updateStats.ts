import { Stat } from "@/models/stats.models";

interface StatUpdate {
    presentationGenerated?: number
    slidesGenerated?: number
    docsUploaded?: number
    totalExports?: number
    aiGenerations?: number
}

export const updateStats = async (userId: string, update: StatUpdate) => {
    await Stat.findOneAndUpdate(
        { userId },
        {
            $inc: update,
            $set: { lastActivity: new Date() }
        },
        { upsert: true, new: true }
    )
}