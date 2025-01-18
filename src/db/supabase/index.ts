import { createClient } from '@supabase/supabase-js'

// Client-side instance (keep existing)
export const supabase = createClient(
	process.env.SUPABASE_PROJECT_URL!,
	process.env.SUPABASE_ANON_KEY!
)

// Server-side instance with service role
export const supabaseAdmin = createClient(
	process.env.SUPABASE_PROJECT_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
)