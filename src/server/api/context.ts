// tRPC context creation
// Creates context for each request with user, session, and database access

import { type inferAsyncReturnType } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { createClient } from '@/lib/supabase/server';

export async function createContext(opts: FetchCreateContextFnOptions) {
    const supabase = createClient();

    // Get the user from the session
    const { data: { user } } = await supabase.auth.getUser();

    return {
        supabase,
        user: user || null,
        req: opts.req,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
