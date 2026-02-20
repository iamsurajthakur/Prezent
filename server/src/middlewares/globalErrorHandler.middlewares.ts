import {type Request, type Response, type NextFunction } from 'express'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    // Only show stack lines from your own code
    const relevantStack = err.stack
        ?.split('\n')
        .filter((line: string) => line.includes('/src/'))
        .join('\n')

    console.error(`[${statusCode}] ${req.method} ${req.path} - ${message}`)
    if (relevantStack) console.error(relevantStack)

    res.status(statusCode).json({
        success: false,
        message,
    })
}

export default errorHandler