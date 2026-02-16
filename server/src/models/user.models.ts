import mongoose from 'mongoose'
import jwt, {type SignOptions } from 'jsonwebtoken'
import env from '@/config/env'
import bcrypt from 'bcrypt'
import { type IUser, type IUserMethods, type UserModel } from '@/types/userModel.types'
import ApiError from '@/utils/apiError'

const userSchema = new mongoose.Schema<IUser, IUserMethods, UserModel>({
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
    },
    refreshToken: {
        type: String,
        default: null,
        select: false,
    }

}, {timestamps: true})

userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash') || !this.passwordHash) return

    this.passwordHash = await bcrypt.hash(this.passwordHash, 10)
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.passwordHash)
}

userSchema.methods.generateAccessToken = function () {

    if(!env.ACCESS_TOKEN_SECRET) throw new ApiError(400,'ACCESS_TOKEN_SECRET is missing')
    if(!env.ACCESS_TOKEN_EXPIRY) throw new ApiError(400,'ACCESS_TOKEN_EXPIRY is missing')

    const options: SignOptions = {
        expiresIn: env.ACCESS_TOKEN_EXPIRY,
    }

    return jwt.sign(
        {
            _id: this._id
        },
        env.ACCESS_TOKEN_SECRET!,
        options
    )
}

userSchema.methods.generateRefreshToken = function () {

    if(!env.REFRESH_TOKEN_SECRET) throw new ApiError(400,'REFRESH_TOKEN_SECRET is missing')
    if(!env.REFRESH_TOKEN_EXPIRY) throw new ApiError(400,'REFRESH_TOKEN_EXPIRY is missing')

    const options: SignOptions = {
        expiresIn: env.REFRESH_TOKEN_EXPIRY,
    }
    
    return jwt.sign(
        {
            _id: this._id
        },
        env.REFRESH_TOKEN_SECRET!,
        options
    )
}

export const User = mongoose.model<IUser, UserModel>("User", userSchema)