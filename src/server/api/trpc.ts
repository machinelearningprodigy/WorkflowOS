// tRPC initialization and middleware
// Sets up tRPC with context, error handling, and authentication

import { initTRPC, TRPCError } from '@trpc/server';
import { type Context } from './context';
import superjson from 'superjson';

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

// Base router and procedure
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    // TODO: Implement authentication check
    // if (!ctx.user) {
    //   throw new TRPCError({ code: 'UNAUTHORIZED' });
    // }
    return next({
        ctx: {
            ...ctx,
            // user: ctx.user,
        },
    });
});

// Admin procedure - requires admin role
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
    // TODO: Implement admin check
    // if (ctx.user.role !== 'ADMIN') {
    //   throw new TRPCError({ code: 'FORBIDDEN' });
    // }
    return next({ ctx });
});
