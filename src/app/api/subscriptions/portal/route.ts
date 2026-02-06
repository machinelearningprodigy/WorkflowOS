
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { stripe } from '@/lib/stripe'

/**
 * Route: POST /api/subscriptions/portal
 * Create a billing portal session.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })

        if (!dbUser?.stripeCustomerId) {
            return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: `${request.nextUrl.origin}/dashboard/settings/billing`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        logger.error('Create portal session failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
