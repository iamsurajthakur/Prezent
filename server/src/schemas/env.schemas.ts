import z from "zod";

const JWTAccessExpiry = z.enum(["15m", "30m", "1h", "1d"])
const JWTRefreshExpiry = z.enum(["3d", "7d", "10d"])

export const envSchema = z.object({
    MONGODB_URI: z.url(),
    PORT: z.coerce.number().default(5000),
    CORS_ORIGIN_DEV: z.url(),
    ACCESS_TOKEN_SECRET: z.string().min(32),
    ACCESS_TOKEN_EXPIRY: JWTAccessExpiry,
    REFRESH_TOKEN_SECRET: z.string().min(32),
    REFRESH_TOKEN_EXPIRY: JWTRefreshExpiry,
    NODE_ENV: z.string()
})
