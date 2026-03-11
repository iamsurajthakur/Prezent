import mongoose, { Schema, Types } from "mongoose";

interface IStat {
    userId: Types.ObjectId
    presentationGenerated: number
    slidesGenerated: number
    docsUploaded: number
    totalExports: number
    aiGenerations: number
    lastActivity: Date
}

const statsSchema = new Schema<IStat>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    presentationGenerated: {
        type: Number,
        default: 0,
    },
    slidesGenerated: {
        type: Number,
        default: 0,
    },
    docsUploaded: {
        type: Number,
        default: 0,
    },
    totalExports: {
        type: Number,
        default: 0,
    },
    aiGenerations: {
        type: Number,
        default: 0,
    },
    lastActivity: {
        type: Date,
        default: null,
    }
}, {timestamps: true})

export const Stat = mongoose.model<IStat>('stat', statsSchema)