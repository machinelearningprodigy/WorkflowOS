import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/usage
 * Returns current usage statistics and limits for the organization.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const orgId = user.id // In production, use actual org ID

        // Get current month start
        const monthStart = new Date()
        monthStart.setDate(1)
        monthStart.setHours(0, 0, 0, 0)

        // Fetch usage data in parallel
        const [workflowCount, runCount, integrationCount, subscription] = await Promise.all([
            prisma.workflow.count({
                where: { creatorId: user.id, status: { not: 'archived' } }
            }),
            prisma.workflowRun.count({
                where: {
                    workflow: { creatorId: user.id },
                    startTime: { gte: monthStart }
                }
            }),
            prisma.orgCredential.count({
                where: { orgId }
            }),
            prisma.subscription.findUnique({
                where: { orgId }
            })
        ])

        // Define plan limits
        const planLimits: Record<string, any> = {
            free: {
                workflows: 5,
                executions: 1000,
                integrations: 3
            },
            starter: {
                workflows: 20,
                executions: 5000,
                integrations: 10
            },
            pro: {
                workflows: -1, // unlimited
                executions: 10000,
                integrations: -1
            },
            team: {
                workflows: -1,
                executions: 50000,
                integrations: -1
            }
        }

        const currentPlan = subscription?.plan || 'free'
        const limits = planLimits[currentPlan] || planLimits.free

        return NextResponse.json({
            usage: {
                workflows: workflowCount,
                executions: runCount,
                integrations: integrationCount
            },
            limits: {
                workflows: limits.workflows,
                executions: limits.executions,
                integrations: limits.integrations
            },
            plan: currentPlan,
            percentages: {
                workflows: limits.workflows > 0 ? (workflowCount / limits.workflows) * 100 : 0,
                executions: limits.executions > 0 ? (runCount / limits.executions) * 100 : 0,
                integrations: limits.integrations > 0 ? (integrationCount / limits.integrations) * 100 : 0
            }
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
