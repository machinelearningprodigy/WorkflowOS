
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { stripe } from '@/lib/stripe'

/**
 * Route: POST /api/subscriptions/create
 * Create a new subscription checkout session.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { priceId, successUrl, cancelUrl } = await request.json()

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
        }

        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        let customerId = dbUser?.stripeCustomerId

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email!,
                metadata: { userId: user.id }
            })
            customerId = customer.id
            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId }
            })
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: successUrl || `${request.nextUrl.origin}/dashboard?success=true`,
            cancel_url: cancelUrl || `${request.nextUrl.origin}/pricing?canceled=true`,
            metadata: { userId: user.id }
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        logger.error('Create subscription failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
