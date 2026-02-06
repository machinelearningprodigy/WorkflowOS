import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Route: POST /api/webhooks/stripe
 * Handles Stripe webhook events for subscription management.
 */
export async function POST(req: NextRequest) {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        logger.error(`Stripe webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                await handleCheckoutCompleted(session)
                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription
                await handleSubscriptionUpdated(subscription)
                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                await handleSubscriptionDeleted(subscription)
                break
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice
                logger.info(`Payment succeeded for invoice ${invoice.id}`)
                break
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice
                logger.warn(`Payment failed for invoice ${invoice.id}`)
                // TODO: Send notification to user
                break
            }

            default:
                logger.info(`Unhandled Stripe event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        logger.error(`Stripe webhook handler error: ${error.message}`)
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const orgId = session.metadata?.orgId
    if (!orgId) return

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    await prisma.subscription.upsert({
        where: { orgId },
        create: {
            orgId,
            plan: session.metadata?.plan || 'pro',
            status: 'active',
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: session.customer as string,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        },
        update: {
            status: 'active',
            stripeSubscriptionId: subscription.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
    })

    logger.info(`Subscription created for org ${orgId}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const orgSubscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id }
    })

    if (!orgSubscription) return

    await prisma.subscription.update({
        where: { id: orgSubscription.id },
        data: {
            status: subscription.status as any,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
    })

    logger.info(`Subscription updated: ${subscription.id}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const orgSubscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id }
    })

    if (!orgSubscription) return

    await prisma.subscription.update({
        where: { id: orgSubscription.id },
        data: {
            status: 'canceled',
            cancelAtPeriodEnd: false
        }
    })

    logger.info(`Subscription canceled: ${subscription.id}`)
}
