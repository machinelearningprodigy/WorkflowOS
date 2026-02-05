// Root tRPC router
// Combines all feature routers into a single app router

import { createTRPCRouter } from './trpc';
import { userRouter } from './routers/user';
import { workflowRouter } from './routers/workflow';
import { integrationRouter } from './routers/integration';
import { analyticsRouter } from './routers/analytics';
import { subscriptionRouter } from './routers/subscription';
import { aiRouter } from './routers/ai';
import { templateRouter } from './routers/template';
import { webhookRouter } from './routers/webhook';
import { notificationRouter } from './routers/notification';
import { auditRouter } from './routers/audit';

export const appRouter = createTRPCRouter({
    user: userRouter,
    workflow: workflowRouter,
    integration: integrationRouter,
    analytics: analyticsRouter,
    subscription: subscriptionRouter,
    ai: aiRouter,
    template: templateRouter,
    webhook: webhookRouter,
    notification: notificationRouter,
    audit: auditRouter,
});

export type AppRouter = typeof appRouter;
