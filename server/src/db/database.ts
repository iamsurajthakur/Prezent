import mongoose from "mongoose";
import env from "@/config/env";
import { DB_NAME } from "@/constant";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection failed: ', error)
        process.exit(1)
    }
}

export default connectDB