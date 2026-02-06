
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { stripe } from '@/lib/stripe'

/**
 * Route: POST /api/subscriptions/upgrade
 * Create a Stripe checkout session for subscription upgrade.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { priceId } = body

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        })

        if (!dbUser?.stripeCustomerId) {
            // Create customer if missing
            const customer = await stripe.customers.create({
                email: user.email!,
                metadata: {
                    userId: user.id
                }
            })

            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customer.id }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: dbUser?.stripeCustomerId ?? undefined,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${request.nextUrl.origin}/dashboard/settings/billing?success=true`,
            cancel_url: `${request.nextUrl.origin}/dashboard/settings/billing?canceled=true`,
            metadata: {
                userId: user.id,
                priceId
            }
        })

        return NextResponse.json({ url: session.url })

    } catch (error: any) {
        logger.error('Subscription upgrade failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
