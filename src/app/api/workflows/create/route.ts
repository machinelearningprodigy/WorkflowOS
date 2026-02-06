import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { validation } from '@/utils/validation'

/**
 * Route: POST /api/workflows/create
 * Creates a new workflow with steps.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, description, trigger, steps } = body

        // Validate name
        const validName = validation.workflowName.safeParse(name)
        if (!validName.success) {
            return NextResponse.json({
                error: validName.error.errors[0].message
            }, { status: 400 })
        }

        // Create workflow with steps in a transaction
        const workflow = await prisma.$transaction(async (tx) => {
            const newWorkflow = await tx.workflow.create({
                data: {
                    name,
                    description,
                    creatorId: user.id,
                    status: 'draft',
                    webhookSlug: Math.random().toString(36).substring(2, 12),
                    trigger: trigger || {}
                }
            })

            // Create steps if provided
            if (steps && Array.isArray(steps) && steps.length > 0) {
                await tx.workflowStep.createMany({
                    data: steps.map((step: any, index: number) => ({
                        workflowId: newWorkflow.id,
                        order: index,
                        type: step.type,
                        provider: step.provider,
                        action: step.action,
                        config: step.config || {}
                    }))
                })
            }

            return newWorkflow
        })

        logger.info(`Workflow created: ${workflow.id} by ${user.id}`)

        return NextResponse.json(workflow, { status: 201 })
    } catch (error: any) {
        logger.error('Workflow creation failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
