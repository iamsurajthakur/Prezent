import { api } from "./api";

type registerRequest = {
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export const registerUser = async (data: registerRequest) => {
    return await api.post('/api/v1/auth/register', data)
}