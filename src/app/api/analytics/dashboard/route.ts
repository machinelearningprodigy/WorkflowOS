import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { analyticsService } from '@/lib/services/analytics.service'

/**
 * Route: GET /api/analytics/dashboard
 * Returns comprehensive analytics data for the dashboard.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = request.nextUrl
        const range = searchParams.get('range') || '30d' // 7d, 30d, 90d, 1y
        const startDate = getStartDate(range)

        // Get workflow run statistics
        const runs = await prisma.workflowRun.groupBy({
            by: ['status'],
            where: {
                workflow: { creatorId: user.id },
                startTime: { gte: startDate }
            },
            _count: true
        })

        const totalRuns = runs.reduce((sum, r) => sum + r._count, 0)
        const successCount = runs.find(r => r.status === 'success')?._count || 0
        const failedCount = runs.find(r => r.status === 'failed')?._count || 0
        const successRate = totalRuns > 0 ? (successCount / totalRuns) * 100 : 0

        // Get time saved estimate
        const timeSavedHours = await analyticsService.getTimeSaved(user.id)

        // Get top performing workflows
        const topWorkflows = await prisma.workflow.findMany({
            where: { creatorId: user.id },
            include: {
                _count: {
                    select: {
                        runs: {
                            where: { startTime: { gte: startDate } }
                        }
                    }
                }
            },
            orderBy: {
                runs: { _count: 'desc' }
            },
            take: 5
        })

        // Get average execution duration
        const avgDuration = await prisma.workflowRun.aggregate({
            where: {
                workflow: { creatorId: user.id },
                startTime: { gte: startDate },
                status: 'success'
            },
            _avg: {
                duration: true
            }
        })

        return NextResponse.json({
            totalExecutions: totalRuns,
            successRate: Math.round(successRate * 10) / 10,
            avgDuration: avgDuration._avg.duration || 0,
            timeSavedHours: Math.round(timeSavedHours),
            runsByStatus: {
                success: successCount,
                failed: failedCount,
                running: runs.find(r => r.status === 'running')?._count || 0
            },
            topWorkflows: topWorkflows.map(w => ({
                id: w.id,
                name: w.name,
                executions: w._count.runs,
                status: w.status
            }))
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

function getStartDate(range: string): Date {
    const now = new Date()
    switch (range) {
        case '7d':
            return new Date(now.setDate(now.getDate() - 7))
        case '30d':
            return new Date(now.setDate(now.getDate() - 30))
        case '90d':
            return new Date(now.setDate(now.getDate() - 90))
        case '1y':
            return new Date(now.setFullYear(now.getFullYear() - 1))
        default:
            return new Date(now.setDate(now.getDate() - 30))
    }
}
