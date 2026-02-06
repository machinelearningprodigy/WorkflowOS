
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/analytics/workflow-performance
 * Get success/failure rates and duration stats.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const stats = await prisma.workflowRun.groupBy({
            by: ['status'],
            where: {
                workflow: { creatorId: user.id }
            },
            _count: { _all: true }
        })

        // Calculate average duration
        const durationAgg = await prisma.workflowRun.aggregate({
            where: {
                workflow: { creatorId: user.id },
                status: 'success'
            },
            _avg: { duration: true }
        })

        const total = stats.reduce((acc, curr) => acc + curr._count._all, 0)
        const successCount = stats.find(s => s.status === 'success')?._count._all || 0
        const failureCount = stats.find(s => s.status === 'failed')?._count._all || 0

        const successRate = total > 0 ? (successCount / total) * 100 : 0

        return NextResponse.json({
            successRate,
            totalRuns: total,
            avgDuration: durationAgg._avg.duration || 0,
            breakdown: stats.map(s => ({ status: s.status, count: s._count._all }))
        })
    } catch (error: any) {
        logger.error('Fetch performance stats failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
