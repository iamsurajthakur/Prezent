import ApiError from "@/utils/apiError";
import asyncHandler from "@/utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.models";
import env from "@/config/env";
import { type Request, type Response, type NextFunction } from "express";

const verifyJWT = asyncHandler(async(req: Request, _: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken

    if(!token){
        throw new ApiError(401,'User not logged in')
    }

    let decoded: any
    try {
        decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET!)
    } catch (err: any) {
        if(err.name == 'TokenExpiredError'){
            throw new ApiError(401, 'Access token expired')
        }
        throw new ApiError(401,'Invalid access token')
    }

    const user = await User.findById(decoded._id).select('-passwordHash -refreshToken -__v')
    if(!user){
        throw new ApiError(404,'User not found')
    }

    req.user = user
    next()
})

export default verifyJWT