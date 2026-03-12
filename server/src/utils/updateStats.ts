import { Stat } from "@/models/stats.models";

interface StatUpdate {
    presentationGenerated?: number
    slidesGenerated?: number
    docsUploaded?: number
    totalExports?: number
    aiGenerations?: number
    addSlidesToChart?: number
}

export const updateStats = async (userId: string, update: StatUpdate) => {
    const {addSlidesToChart, ...rest} = update

    const today = new Date().toLocaleDateString("en-US", { weekday: "short" })

    const statDoc = await Stat.findOneAndUpdate(
        { userId },
        {
            $inc: rest,
            $set: { lastActivity: new Date() }
        },
        { upsert: true, new: true }
    )

    // update weekly chart if slide were generated
    if(addSlidesToChart && statDoc){
        const existingDay = statDoc.weeklyActivity?.find((d: any) => d.day === today)

        if(existingDay){
            // if day exist increment the count
            await Stat.updateOne(
                { userId, "weeklyActivity.day": today },
                { $inc: { "weeklyActivity.$.count": addSlidesToChart }}
            )
        }else{
            // if not push new entry
            await Stat.updateOne(
                { userId },
                { $push: { weeklyActivity: { day: today, count: addSlidesToChart }}}
            )
        }
    }
}