
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { Parser } from 'json2csv'

/**
 * Route: GET /api/analytics/export
 * Export analytics data.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = request.nextUrl
        const range = searchParams.get('range') || '30d'

        // Fetch aggregated data (mocked/simplified for export)
        const runs = await prisma.workflowRun.findMany({
            where: {
                workflow: { creatorId: user.id }
            },
            take: 1000,
            orderBy: { startTime: 'desc' },
            include: {
                workflow: { select: { name: true } }
            }
        })

        const fields = ['id', 'workflow.name', 'status', 'startTime', 'duration', 'triggerType']
        const parser = new Parser({ fields })
        const csv = parser.parse(runs)

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="analytics-${range}-${new Date().toISOString()}.csv"`
            }
        })
    } catch (error: any) {
        logger.error('Export analytics failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
