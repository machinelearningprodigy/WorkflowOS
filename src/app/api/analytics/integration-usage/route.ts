
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/analytics/integration-usage
 * Get usage stats per integration.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Group runs by provider/integration type
        // This query might need to be adjusted based on actual schema structure.
        // Assuming workflow steps determine integration usage.

        // Complex aggregation usually better via raw SQL or specific analytics DB (e.g. Tinybird/Clickhouse)
        // Here we mock using prisma aggregation on existing structure if possible or simple counts

        const usage = await prisma.workflowStep.groupBy({
            by: ['provider'],
            where: {
                workflow: { creatorId: user.id }
            },
            _count: {
                _all: true
            }
        })

        // Map to friendlier format
        const formatted = usage.map(u => ({
            name: u.provider,
            count: u._count._all
        })).sort((a, b) => b.count - a.count)

        return NextResponse.json(formatted)
    } catch (error: any) {
        logger.error('Fetch integration usage failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
