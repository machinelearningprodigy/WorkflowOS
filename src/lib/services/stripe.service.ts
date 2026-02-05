// Stripe service for subscription and payment management
// Handles checkout, subscriptions, and webhooks

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
});

/**
 * Create checkout session for new subscription
 */
export async function createCheckoutSession(
    userId: string,
    email: string,
    tier: 'STARTER' | 'PROFESSIONAL' | 'BUSINESS',
    billingPeriod: 'monthly' | 'annual'
): Promise<{ sessionId: string; url: string }> {
    try {
        // TODO: Get price ID from tier and billing period
        const priceId = 'price_xxx'; // Replace with actual price IDs

        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            client_reference_id: userId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
            metadata: {
                userId,
                tier,
                billingPeriod,
            },
        });

        return {
            sessionId: session.id,
            url: session.url!,
        };
    } catch (error) {
        console.error('Stripe checkout error:', error);
        throw new Error('Failed to create checkout session');
    }
}

/**
 * Create customer portal session
 */
export async function createPortalSession(
    customerId: string
): Promise<{ url: string }> {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
        });

        return { url: session.url };
    } catch (error) {
        console.error('Stripe portal error:', error);
        throw new Error('Failed to create portal session');
    }
}

/**
 * Get customer subscriptions
 */
export async function getCustomerSubscriptions(customerId: string) {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
        });

        return subscriptions.data;
    } catch (error) {
        console.error('Stripe subscriptions error:', error);
        return [];
    }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
    try {
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        return true;
    } catch (error) {
        console.error('Stripe cancel error:', error);
        return false;
    }
}

/**
 * Update subscription
 */
export async function updateSubscription(
    subscriptionId: string,
    newPriceId: string
) {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await stripe.subscriptions.update(subscriptionId, {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: newPriceId,
                },
            ],
            proration_behavior: 'create_prorations',
        });

        return true;
    } catch (error) {
        console.error('Stripe update error:', error);
        return false;
    }
}

/**
 * Get customer invoices
 */
export async function getCustomerInvoices(customerId: string) {
    try {
        const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 12,
        });

        return invoices.data;
    } catch (error) {
        console.error('Stripe invoices error:', error);
        return [];
    }
}

/**
 * Verify webhook signature
 */
export function verifyWebhook(
    payload: string | Buffer,
    signature: string,
    secret: string
): Stripe.Event {
    return stripe.webhooks.constructEvent(payload, signature, secret);
}
