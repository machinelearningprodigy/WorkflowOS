
import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { createClient } from '@/lib/supabase/server';
import { type NextRequest } from 'next/server';

interface CreateContextOptions {
    req?: NextRequest | Request;
    resHeaders?: Headers;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (opts?: CreateContextOptions) => {
    const supabase = createClient();

    // Get user from session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Check for organization context (optional, based on request headers or logic)
    // For now we just return user and supabase client
    let organization = null;
    if (user) {
        // We could fetch the user's default organization here if needed
        // For efficiency we might let routers handle this or cache it
    }

    return {
        user,
        supabase,
        req: opts?.req,
        // organization
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
