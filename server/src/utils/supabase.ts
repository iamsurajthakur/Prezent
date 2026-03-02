import env from "@/config/env";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabase: SupabaseClient = createClient(
    env.SUPABASE_URI,
    env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            // Disabling the supabase auth helpers; we will manage our own JWT flow
            persistSession: false,
            autoRefreshToken: false,
        }
    }
)