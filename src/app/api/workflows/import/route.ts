import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/import
 * Imports a workflow from JSON format.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { workflow, steps } = body

        if (!workflow || !workflow.name) {
            return NextResponse.json({
                error: 'Invalid workflow data'
            }, { status: 400 })
        }

        // Import workflow with steps in a transaction
        const importedWorkflow = await prisma.$transaction(async (tx) => {
            const newWorkflow = await tx.workflow.create({
                data: {
                    name: workflow.name,
                    description: workflow.description || '',
                    creatorId: user.id,
                    status: 'draft',
                    webhookSlug: Math.random().toString(36).substring(2, 12),
                    trigger: workflow.trigger || {}
                }
            })

            // Import steps if provided
            if (steps && Array.isArray(steps) && steps.length > 0) {
                await tx.workflowStep.createMany({
                    data: steps.map((step: any, index: number) => ({
                        workflowId: newWorkflow.id,
                        order: step.order ?? index,
                        type: step.type,
                        provider: step.provider,
                        action: step.action,
                        config: step.config || {}
                    }))
                })
            }

            return newWorkflow
        })

        logger.info(`Workflow imported: ${importedWorkflow.id} by ${user.id}`)

        return NextResponse.json({
            success: true,
            workflow: importedWorkflow
        }, { status: 201 })
    } catch (error: any) {
        logger.error('Workflow import failed:', error.message)
        return NextResponse.json({
            error: 'Failed to import workflow'
        }, { status: 500 })
    }
}
