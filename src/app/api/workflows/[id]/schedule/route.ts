
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/[id]/schedule
 * Update workflow schedule (cron).
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { cron } = await request.json()

        // Validate cron string here usually

        await prisma.workflow.update({
            where: { id: params.id, creatorId: user.id },
            data: { cronSchedule: cron }
        })

        // Also update Temporal schedule here if using Temporal Schedules

        return NextResponse.json({ message: 'Schedule updated' })
    } catch (error: any) {
        logger.error('Update schedule failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
