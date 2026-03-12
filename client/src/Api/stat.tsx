import { api } from "./api";

interface exportApiResponse {
    data: {
        statusCode: number
        data: {}
        message: string
    }
}

interface statApiResponse {
    data: {
        statusCode: number
        data: {
            presentationGenerated: number
            slidesGenerated: number
            docsUploaded: number
            totalExports: number
            aiGenerations: number
            lastActivity: string | null
            weeklyActivity: {
                day: string
                count: number
            }[]
        }
        message: string
    }
}

interface presentationResponse {
    data: {
        statusCode: number
        data: {
            presentations: {
                id: string
                name: string
                slides: number
                outputUrl: string
                date: string
            }[]
        }
        message: string
    }
}

export const trackExport = async (): Promise<exportApiResponse> => {
    return api.post('/api/v1/stat/export')
}

export const getStats = async (): Promise<statApiResponse> => {
    return api.get('/api/v1/stat/getStats')
}

export const getRecentPresentation = async (): Promise<presentationResponse> => {
    return api.get('/api/v1/stat/getRecentPresentations')
}