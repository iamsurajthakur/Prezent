import express, {type Request,type Response} from 'express'
import env from './config/env'
import cors from 'cors'
import cookiePaser from 'cookie-parser'
import errorHandler from '@middlewares/globalErrorHandler.middlewares'


const app = express()

const allowedOrigins = [
    env.CORS_ORIGIN_DEV,
    env.CORS_ORIGIN_PROD
]

app.use(
    cors({
        origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
            if (!origin) return cb(null, true)

            if (allowedOrigins.includes(origin)){
                cb(null, true)
            }else{
                cb(null, false)
            }
        },
        credentials: true,
    })
)

app.use(cookiePaser())
app.use(express.json({ limit: '20kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))

app.get('/', (_: Request, res: Response) => {
    res.send('API is running...')
})

app.get('/ping', (_: Request, res: Response) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: Date.now()
    })
})

// Import routes
import userRouter from '@routes/auth.routes'
import uploadRouter from '@routes/upload.routes'
import processRouter from '@routes/process.routes'
import slideRouter from '@routes/slide.routes'

// Routes definition
app.use('/api/v1/auth', userRouter)
app.use('/api/v1/upload', uploadRouter)
app.use('/api/v1/process',processRouter)
app.use('/api/v1/slide', slideRouter)


app.use(errorHandler)

export default app