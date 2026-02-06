
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/utils/logger'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/invoices
 * List user invoices from Stripe.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        })

        if (!dbUser?.stripeCustomerId) {
            return NextResponse.json([])
        }

        const invoices = await stripe.invoices.list({
            customer: dbUser.stripeCustomerId,
            limit: 10
        })

        return NextResponse.json(invoices.data)
    } catch (error: any) {
        logger.error('Fetch invoices failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
