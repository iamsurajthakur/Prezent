import { Model, Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId,
    fullName: string,
    email: string,
    passwordHash?: string | null,
    refreshToken?: string | null,
}

export interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>
    generateAccessToken(): string
    generateRefreshToken(): string
}

export type UserModel = Model<IUser, {}, IUserMethods>