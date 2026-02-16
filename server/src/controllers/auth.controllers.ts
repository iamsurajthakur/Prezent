import { User } from "@/models/user.models";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import asyncHandler from "@/utils/asyncHandler";
import bcrypt from "bcrypt"
import {type Request, type Response } from "express";
import jwt from 'jsonwebtoken'
import env from "@/config/env";

const generateAccessAndRefreshToken = async (userId: any): Promise<{ accessToken: string, refreshToken: string}> => {
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(400,'User not found')
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user?.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error: any) {
        throw new ApiError(500,'Something went wrong',error)
    }
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const {fullName, email, password, confirmPassword} = req.body

    if(!fullName || !email || !password){
        throw new ApiError(400, "All feild are required.")
    }
    if(password != confirmPassword){
        throw new ApiError(400, "Password does not match.")
    }

    const existingUser = await User.findOne({ email })
    if(existingUser){
        throw new ApiError(409,"User already exists.")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        fullName,
        email,
        passwordHash: hashedPassword,
    })

    const createdUser = await User.findById(user._id).select('-passwordHash -__v -createdAt -updatedAt')

    res.status(201).json(new ApiResponse(200,createdUser, "User registered successfully."))
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400,'Failed to login due to invalid email or password')
    }

    const user = await User.findOne({ email })

    if(!user){
        throw new ApiError(404,'User not found.')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,'Invalid password')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    if(!accessToken){
        throw new ApiError(500,'Access Token generation failed')
    }

    const loggedInUser = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
    }

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
        path: '/',
    }

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                },
                'User logged in successfully.'
            )
        )
})

export {
    registerUser,
    loginUser
}