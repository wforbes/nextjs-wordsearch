import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_PROJECT_URL) {
    throw new Error('Missing SUPABASE_PROJECT_URL environment variable')
}

if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false
        },
        db: {
            schema: 'public'
        }
    }
) 