import { User } from "@/models/user.models";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import asyncHandler from "@/utils/asyncHandler";
import bcrypt from "bcryptjs"
import crypto from 'crypto'
import {type Request, type Response } from "express";
import jwt, { decode } from 'jsonwebtoken'
import env from "@/config/env";
import { rmSync } from "fs";

type JWTUserPayload = {
    _id: string,
}

const generateAccessAndRefreshToken = async (userId: any) => {
    const user = await User.findById(userId).select('+refreshToken')
    if (!user) throw new ApiError(400, 'User not found')

    const accessToken = user.generateAccessToken()

    let refreshToken = user.refreshToken
    if (!refreshToken) {
        refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
    }

    return { accessToken, refreshToken }
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

    const user = await User.create({
        fullName,
        email,
        passwordHash: password,
    })

    const createdUser = await User.findById(user._id).select('-passwordHash -__v -createdAt -updatedAt')

    res.status(201).json(new ApiResponse(200,createdUser, "User registered successfully."))
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400,'Failed to login due to invalid email or password')
    }

    const user = await User.findOne({ email }).select('+passwordHash')

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
        sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
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
                },
                'User logged in successfully.'
            )
        )
})

const getMe = asyncHandler(async (req: Request, res: Response) => {
    try {
        const token = req.cookies.accessToken
        if(!token) return res.status(401).json({message: "Not logged in"})
    
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET!) as JWTUserPayload
    
        const user = await User.findById(decoded._id).select("-passwordHash")
    
        if(!user){
            throw new ApiError(404,'User not found')
        }
    
        res.json(new ApiResponse(200,user,'success'))
    } catch (err: any) {
        if(err.name == "TokenExpiredError"){
            return res.status(401).json({ message: 'Access token expired'})
        }
        return res.status(401).json({ message: 'Invalid token'})
    }
})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const userRefreshToken = req.cookies.refreshToken
    if(!userRefreshToken){
        throw new ApiError(400,'Unauthorized request')
    }

    let decoded: any
    try {
        console.log('Secret: ', env.REFRESH_TOKEN_SECRET)
        console.log('Token received: ', userRefreshToken)
        decoded = jwt.verify(userRefreshToken, env.REFRESH_TOKEN_SECRET)
    } catch (error: any) {
        throw new ApiError(401,'Invalid or expired refresh token')
    }

    const user = await User.findById(decoded._id).select('-passwordHash +refreshToken')
    if(!user){
        throw new ApiError(400,'User not found')
    }

    console.log('User refresh token: ',user.refreshToken)
    console.log('Incoming refresh token: ', userRefreshToken)
    if(user.refreshToken !== userRefreshToken){
        throw new ApiError(401,'Refresh token mismatch or expired')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
        path: '/',
    }

    res
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            'Token refreshed'
        ))

})

const logout = asyncHandler(async (req: Request, res: Response) => {
    await User.findByIdAndUpdate(req.user?._id, {
        $unset: { refreshToken: 1 }
    })

    const options = {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
        path: '/',
    }

    res
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .status(200)
        .json(new ApiResponse(200, null, 'Logged out successfylly'))
})

export {
    registerUser,
    loginUser,
    getMe,
    refreshAccessToken,
    logout,
}