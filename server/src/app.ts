import express, {type Request,type Response} from 'express'


const app = express()


app.get('/', (req: Request, res: Response) => {
    res.send('API is running...')
})

// Import routes
import userRouter from '@routes/auth.routes'

// Routes defination
app.use('/api/v1/auth', userRouter)

export default app