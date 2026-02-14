import { User } from "@/models/user.models";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import asyncHandler from "@/utils/asyncHandler";
import bcrypt from "bcrypt"
import {type Request, type Response } from "express";

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

export {
    registerUser,
}