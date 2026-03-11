import { api } from "./api";

interface Response {
    data: {
        statusCode: number
        data: {}
        message: string
    }
}

export const trackExport = async (): Promise<Response> => {
    return api.post('/api/v1/stat/export')
}