/**
 * Subscription and billing related types.
 */

export type PlanType = 'free' | 'starter' | 'pro' | 'team' | 'enterprise';

export interface Subscription {
    id: string;
    orgId: string;
    plan: PlanType;
    status: 'active' | 'past_due' | 'canceled' | 'trialing';
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId?: string;
}

export interface UsageMetric {
    executions: {
        used: number;
        limit: number;
    };
    workflows: {
        used: number;
        limit: number;
    };
}

export interface Invoice {
    id: string;
    amount: number;
    currency: string;
    status: 'paid' | 'open' | 'uncollectible' | 'void';
    date: string;
    pdfUrl?: string;
}
