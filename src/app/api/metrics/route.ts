import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/metrics
 * Returns system and usage metrics.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const now = new Date()
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Get execution metrics
        const [executions24h, executions7d, totalWorkflows, activeWorkflows] = await Promise.all([
            prisma.workflowRun.count({
                where: {
                    workflow: { creatorId: user.id },
                    startTime: { gte: last24Hours }
                }
            }),
            prisma.workflowRun.count({
                where: {
                    workflow: { creatorId: user.id },
                    startTime: { gte: last7Days }
                }
            }),
            prisma.workflow.count({
                where: { creatorId: user.id }
            }),
            prisma.workflow.count({
                where: { creatorId: user.id, status: 'active' }
            })
        ])

        // Get error rate
        const failedExecutions = await prisma.workflowRun.count({
            where: {
                workflow: { creatorId: user.id },
                startTime: { gte: last24Hours },
                status: 'failed'
            }
        })

        const errorRate = executions24h > 0 ? (failedExecutions / executions24h) * 100 : 0

        // Get average execution time
        const avgDuration = await prisma.workflowRun.aggregate({
            where: {
                workflow: { creatorId: user.id },
                startTime: { gte: last24Hours },
                status: 'success'
            },
            _avg: {
                duration: true
            }
        })

        return NextResponse.json({
            executions: {
                last24Hours: executions24h,
                last7Days: executions7d,
                perHour: Math.round(executions24h / 24)
            },
            workflows: {
                total: totalWorkflows,
                active: activeWorkflows,
                inactive: totalWorkflows - activeWorkflows
            },
            performance: {
                avgDuration: avgDuration._avg.duration || 0,
                errorRate: Math.round(errorRate * 10) / 10,
                successRate: Math.round((100 - errorRate) * 10) / 10
            },
            timestamp: now.toISOString()
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
