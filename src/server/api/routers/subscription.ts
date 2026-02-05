// Subscription router - Handles billing and subscription management

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const subscriptionRouter = createTRPCRouter({
    // Get current subscription details
    getCurrent: protectedProcedure.query(async ({ ctx }) => {
        // TODO: Get subscription from database and Stripe
        return null;
    }),

    // Get available plans
    getPlans: protectedProcedure.query(async ({ ctx }) => {
        // TODO: Return available subscription tiers
        return [];
    }),

    // Create checkout session for new subscription
    createCheckoutSession: protectedProcedure
        .input(
            z.object({
                tier: z.enum(['STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE']),
                billingPeriod: z.enum(['monthly', 'annual']),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // TODO: Create Stripe checkout session
            return { sessionId: '', url: '' };
        }),

    // Create portal session for managing subscription
    createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
        // TODO: Create Stripe customer portal session
        return { url: '' };
    }),

    // Upgrade subscription
    upgrade: protectedProcedure
        .input(
            z.object({
                tier: z.enum(['PROFESSIONAL', 'BUSINESS', 'ENTERPRISE']),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // TODO: Upgrade subscription via Stripe
            return null;
        }),

    // Downgrade subscription
    downgrade: protectedProcedure
        .input(
            z.object({
                tier: z.enum(['STARTER', 'PROFESSIONAL', 'BUSINESS']),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // TODO: Schedule downgrade for end of billing period
            return null;
        }),

    // Cancel subscription
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
        // TODO: Cancel subscription at end of billing period
        return null;
    }),

    // Get usage stats for current billing period
    getUsage: protectedProcedure.query(async ({ ctx }) => {
        // TODO: Calculate usage against plan limits
        return {
            workflowsUsed: 0,
            workflowLimit: 0,
            runsUsed: 0,
            runLimit: 0,
            usersUsed: 0,
            userLimit: 0,
        };
    }),

    // Get billing history
    getBillingHistory: protectedProcedure.query(async ({ ctx }) => {
        // TODO: Get invoices from Stripe
        return [];
    }),
});
