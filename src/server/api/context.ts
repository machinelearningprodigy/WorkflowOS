// tRPC context creation
// Creates context for each request with user, session, and database access

import { type inferAsyncReturnType } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createContext(opts: FetchCreateContextFnOptions) {
    // TODO: Implement context with Clerk auth, Prisma client, and request info
    return {
        // user: await getCurrentUser(),
        // db: prisma,
        // req: opts.req,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
