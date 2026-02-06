
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { Connection } from '@temporalio/client'

/**
 * Route: POST /api/workflows/[id]/runs/[runId]/cancel
 * Cancel a running workflow execution.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string, runId: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const run = await prisma.workflowRun.findUnique({
            where: { id: params.runId },
            include: { workflow: true }
        })

        if (!run || run.workflow.creatorId !== user.id) {
            return NextResponse.json({ error: 'Run not found' }, { status: 404 })
        }

        // Connect to Temporal to cancel
        const connection = await Connection.connect()
        const handle = connection.workflow.getHandle(run.id)

        await handle.cancel()

        // Update DB status
        await prisma.workflowRun.update({
            where: { id: params.runId },
            data: { status: 'cancelled' }
        })

        return NextResponse.json({ message: 'Workflow run cancelled' })
    } catch (error: any) {
        logger.error('Cancel run failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
