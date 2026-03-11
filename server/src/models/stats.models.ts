import mongoose, { Schema } from "mongoose";

const statsSchema = new Schema({
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

export const Stat = mongoose.model('stat', statsSchema)