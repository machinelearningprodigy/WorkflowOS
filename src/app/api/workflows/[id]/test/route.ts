
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/[id]/test
 * Trigger a test run of the workflow.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        // Create a test run record
        const run = await prisma.workflowRun.create({
            data: {
                workflowId: params.id,
                status: 'running',
                triggerType: 'manual_test',
                input: body
            }
        })

        // Trigger execution engine (e.g. Temporal)

        return NextResponse.json(run)
    } catch (error: any) {
        logger.error('Test workflow failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
