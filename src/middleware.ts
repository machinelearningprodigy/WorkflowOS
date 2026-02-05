// Next.js middleware for authentication and security
// Runs on every request before reaching the page

import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
    // Public routes that don't require authentication
    publicRoutes: [
        '/',
        '/pricing',
        '/sign-in(.*)',
        '/sign-up(.*)',
        '/api/webhooks(.*)',
    ],

    // Routes that are ignored by the middleware
    ignoredRoutes: [
        '/api/webhooks/clerk',
        '/api/webhooks/stripe',
    ],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
