
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/utils/logger'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/invoices/[id]
 * Get specific invoice details.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        })

        const invoice = await stripe.invoices.retrieve(params.id)

        if (invoice.customer !== dbUser?.stripeCustomerId) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        return NextResponse.json(invoice)
    } catch (error: any) {
        logger.error('Fetch invoice failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
