import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/subscriptions
 * Returns the current subscription status for the user's organization.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const orgId = user.id // In production, use actual org ID

        const subscription = await prisma.subscription.findUnique({
            where: { orgId }
        })

        if (!subscription) {
            // Return default free plan
            return NextResponse.json({
                plan: 'free',
                status: 'active',
                currentPeriodEnd: null,
                cancelAtPeriodEnd: false
            })
        }

        return NextResponse.json({
            id: subscription.id,
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            stripeSubscriptionId: subscription.stripeSubscriptionId
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
