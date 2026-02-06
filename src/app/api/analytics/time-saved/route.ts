
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/analytics/time-saved
 * Calculate estimated time saved by automation.
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

        // Logic: specific actions save specific amount of minutes.
        // E.g. email = 2 min, data entry = 5 min

        const totalRuns = await prisma.workflowRun.count({
            where: {
                workflow: { creatorId: user.id },
                status: 'success'
            }
        })

        // Simplistic formula for MVP: 2 minutes per run average
        const minutesSaved = totalRuns * 2
        const hoursSaved = Math.round(minutesSaved / 60)

        // Return a trend (mocked for now)
        const trend = 15 // +15%

        return NextResponse.json({
            totalHours: hoursSaved,
            trend,
            breakdown: {
                'Email Automation': Math.round(hoursSaved * 0.4),
                'Data Sync': Math.round(hoursSaved * 0.3),
                'Reports': Math.round(hoursSaved * 0.3)
            }
        })
    } catch (error: any) {
        logger.error('Fetch time saved failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}