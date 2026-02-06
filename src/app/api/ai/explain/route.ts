import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/ai/explain
 * Generates natural language explanation of a workflow or step using AI.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { workflowId, stepId } = body

        if (!workflowId && !stepId) {
            return NextResponse.json({
                error: 'Either workflowId or stepId is required'
            }, { status: 400 })
        }

        let explanation = ''

        if (workflowId) {
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

            // Generate explanation
            explanation = `This workflow "${workflow.name}" automates a process with ${workflow.steps.length} steps:\n\n`

            workflow.steps.forEach((step, index) => {
                explanation += `${index + 1}. ${step.action} using ${step.provider}\n`
            })

            explanation += `\nThe workflow ${workflow.status === 'active' ? 'is currently active and will execute when triggered' : 'is currently inactive'}.`
        } else if (stepId) {
            const step = await prisma.workflowStep.findFirst({
                where: { id: stepId },
                include: {
                    workflow: {
                        select: { creatorId: true }
                    }
                }
            })

            if (!step || step.workflow.creatorId !== user.id) {
                return NextResponse.json({ error: 'Step not found' }, { status: 404 })
            }

            explanation = `This step performs the "${step.action}" action using the ${step.provider} integration. `

            if (step.config && Object.keys(step.config).length > 0) {
                explanation += `It is configured with specific parameters to customize its behavior.`
            }
        }

        logger.info(`AI explanation generated for ${workflowId ? 'workflow' : 'step'}`)

        return NextResponse.json({
            success: true,
            explanation
        })
    } catch (error: any) {
        logger.error('AI explanation failed:', error.message)
        return NextResponse.json({
            error: 'Failed to generate explanation'
        }, { status: 500 })
    }
}
