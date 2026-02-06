import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyticsService } from '@/lib/services/analytics.service'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/analytics/roi
 * Calculates return on investment for workflow automation.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const orgId = user.id

        // Get subscription cost
        const subscription = await prisma.subscription.findUnique({
            where: { orgId }
        })

        const planCosts: Record<string, number> = {
            free: 0,
            starter: 29,
            pro: 99,
            team: 299
        }

        const monthlyCost = subscription ? planCosts[subscription.plan] || 0 : 0

        // Get time saved
        const timeSavedHours = await analyticsService.getTimeSaved(user.id)

        // Calculate money saved (assuming $50/hour labor cost)
        const hourlyRate = 50
        const moneySaved = timeSavedHours * hourlyRate

        // Calculate ROI
        const roi = monthlyCost > 0 ? ((moneySaved - monthlyCost) / monthlyCost) * 100 : 0

        // Get execution count
        const totalExecutions = await prisma.workflowRun.count({
            where: { workflow: { creatorId: user.id } }
        })

        return NextResponse.json({
            timeSavedHours: Math.round(timeSavedHours),
            moneySaved: Math.round(moneySaved),
            subscriptionCost: monthlyCost,
            roi: Math.round(roi),
            totalExecutions,
            averageTimePerExecution: totalExecutions > 0 ? timeSavedHours / totalExecutions : 0,
            breakEvenPoint: monthlyCost > 0 ? Math.ceil(monthlyCost / (hourlyRate * 0.5)) : 0 // hours needed to break even
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
