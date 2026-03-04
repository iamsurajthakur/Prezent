import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
    status: {
        type: String,
        enum: ['pending','processing','done','error'],
        default: 'pending',
    },
    outputUrl: {
        type: String,
        default: null,
    }
},{timestamps: true})

export const Job = mongoose.model('job',jobSchema)