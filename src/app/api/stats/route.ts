import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { analyticsService } from '@/lib/services/analytics.service'

/**
 * Route: GET /api/stats
 * Returns high-level statistics for the user's dashboard.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const [workflowCount, runStats, timeSaved] = await Promise.all([
            prisma.workflow.count({
                where: { creatorId: user.id, status: { not: 'archived' } }
            }),
            prisma.workflowRun.groupBy({
                by: ['status'],
                where: { workflow: { creatorId: user.id } },
                _count: true
            }),
            analyticsService.getTimeSaved(user.id)
        ])

        const totalRuns = runStats.reduce((sum, r) => sum + r._count, 0)
        const successCount = runStats.find(r => r.status === 'success')?._count || 0
        const successRate = totalRuns > 0 ? (successCount / totalRuns) * 100 : 0

        return NextResponse.json({
            workflows: workflowCount,
            totalExecutions: totalRuns,
            successRate: Math.round(successRate * 10) / 10,
            timeSavedHours: Math.round(timeSaved),
            runsByStatus: {
                success: successCount,
                failed: runStats.find(r => r.status === 'failed')?._count || 0,
                running: runStats.find(r => r.status === 'running')?._count || 0
            }
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
