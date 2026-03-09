import env from "@/config/env";
import { OpenAI } from "openai";

export const hfClient = new OpenAI({
    baseURL: env.HF_API,
    apiKey: env.HF_API_TOKEN
})