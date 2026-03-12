import mongoose, { Schema, Types } from "mongoose";

interface IActivity {
    userId: Types.ObjectId
    type: 'upload' | 'generate' | 'export'
    label: string
    subject: string
    context?: string
    createdAt: Date
}

const activitySchema = new Schema<IActivity>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['upload','generate','export'],
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    context: {
        type: String,
        default: null,
    }
}, {timestamps: true})

export const Activity = mongoose.model<IActivity>('Activity', activitySchema)