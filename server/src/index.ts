import app from './app'
import connectDB from '@db/database'
import env from '@/config/env'

connectDB()
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`Server running at port ${env.PORT}`)
        })
    })
    .catch((error) => {
        console.log('MongoDB connection failed !! ',error)
    })