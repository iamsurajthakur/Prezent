import z from "zod";

export const envSchema = z.object({
    MONGODB_URI: z.url(),
    PORT: z.coerce.number().default(5000),
})
