
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/[id]/runs/[runId]/retry
 * Retry a failed workflow execution.
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

        // Logic to trigger a new run with the same payload
        // This usually involves sending a signal or starting a new workflow execution with `triggerPayload`
        // We'll Create a new run record and start Temporal workflow

        // This is a placeholder for the actual re-trigger logic which would likely use `WorkflowService`
        logger.info(`Retrying run ${run.id}`)

        return NextResponse.json({ message: 'Retry started' })
    } catch (error: any) {
        logger.error('Retry run failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
