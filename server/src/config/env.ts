import "dotenv/config"
import { envSchema } from "@/schemas/env.schemas"

const env = envSchema.parse(process.env)

export default env