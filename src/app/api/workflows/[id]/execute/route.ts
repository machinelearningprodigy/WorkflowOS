import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { startWorkflow } from '@/temporal/client'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/[id]/execute
 * Manually triggers a workflow execution.
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflowId = params.id

    try {
        // Fetch workflow with steps
        const workflow = await prisma.workflow.findFirst({
            where: {
                id: workflowId,
                creatorId: user.id
            },
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        if (workflow.status !== 'active') {
            return NextResponse.json({
                error: 'Workflow must be active to execute'
            }, { status: 400 })
        }

        // Parse optional trigger data from request
        const body = await request.json().catch(() => ({}))
        const triggerData = body.input || {}

        // Start Temporal workflow
        const runId = await startWorkflow({
            workflowId: workflow.id,
            userId: user.id,
            steps: workflow.steps as any,
            triggerData
        })

        logger.info(`Manual execution started for workflow ${workflowId}, Run ID: ${runId}`)

        return NextResponse.json({
            success: true,
            run_id: runId,
            message: 'Workflow execution started'
        }, { status: 202 })
    } catch (error: any) {
        logger.error(`Failed to execute workflow ${workflowId}:`, error.message)
        return NextResponse.json({
            error: 'Failed to start workflow execution'
        }, { status: 500 })
    }
}
