// Supabase client - Server-side Supabase client
// For direct database access, RLS, storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client for RLS-enabled queries
export const supabase = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
