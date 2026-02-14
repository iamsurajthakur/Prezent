import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        default: null,
        select: false,
    }

}, {timestamps: true})

export const User = mongoose.model("User", userSchema)