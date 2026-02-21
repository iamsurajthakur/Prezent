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

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...')
})

// Import routes
import userRouter from '@routes/auth.routes'

// Routes defination
app.use('/api/v1/auth', userRouter)

app.use(errorHandler)

export default app