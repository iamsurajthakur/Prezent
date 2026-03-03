import { api } from "./api";

interface uploadResponse {
    data: {
        statusCode: number
        data: {
            signedUrl: string
            expiresInSeconds: number
            file: {
                originalName: string
                mimeType: string
                sizeBytes: number
                storagePath: string
            }
        }
        message: string
    }
}

export const uploadFile = async (data: FormData): Promise<uploadResponse> => {
    return await api.post('/api/v1/upload/uploadFile', data)
}