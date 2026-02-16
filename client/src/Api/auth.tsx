import { api } from "./api";

type registerRequest = {
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
}
type loginRequest = {
    email: string,
    password: string,
}

export const registerUser = async (data: registerRequest) => {
    return await api.post('/api/v1/auth/register', data)
}

export const loginUser = async (data: loginRequest) => {
    return await api.post('/api/v1/auth/login', data)
}