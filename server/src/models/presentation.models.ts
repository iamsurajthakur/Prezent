import mongoose, { Schema, Types } from "mongoose";

interface IPresentation {
    userId: Types.ObjectId
    name: string
    slides: number
    outputUrl: string
    createdAt: Date
}

const presentationSchema = new Schema<IPresentation>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    slides: {
        type: Number,
        required: true,
    },
    outputUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export const Presentation = mongoose.model<IPresentation>("presentation", presentationSchema)