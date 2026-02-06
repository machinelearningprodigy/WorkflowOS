import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/workflows/[id]
 * Retrieves a single workflow by ID.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const workflow = await prisma.workflow.findFirst({
            where: {
                id: params.id,
                creatorId: user.id
            },
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                },
                _count: {
                    select: { runs: true }
                }
            }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        return NextResponse.json(workflow)
    } catch (error: any) {
        logger.error(`Failed to fetch workflow ${params.id}:`, error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: PATCH /api/workflows/[id]
 * Updates a workflow.
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, description, status, steps } = body

        // Verify ownership
        const existing = await prisma.workflow.findFirst({
            where: { id: params.id, creatorId: user.id }
        })

        if (!existing) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        // Update workflow
        const workflow = await prisma.workflow.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(status && { status }),
                updatedAt: new Date()
            }
        })

        // Update steps if provided
        if (steps && Array.isArray(steps)) {
            // Delete existing steps
            await prisma.workflowStep.deleteMany({
                where: { workflowId: params.id }
            })

            // Create new steps
            await prisma.workflowStep.createMany({
                data: steps.map((step: any, index: number) => ({
                    workflowId: params.id,
                    order: index,
                    type: step.type,
                    provider: step.provider,
                    action: step.action,
                    config: step.config || {}
                }))
            })
        }

        logger.info(`Workflow updated: ${params.id}`)
        return NextResponse.json(workflow)
    } catch (error: any) {
        logger.error(`Failed to update workflow ${params.id}:`, error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: DELETE /api/workflows/[id]
 * Deletes a workflow.
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Verify ownership
        const workflow = await prisma.workflow.findFirst({
            where: { id: params.id, creatorId: user.id }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        // Delete workflow (cascade will handle steps and runs)
        await prisma.workflow.delete({
            where: { id: params.id }
        })

        logger.info(`Workflow deleted: ${params.id}`)
        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        logger.error(`Failed to delete workflow ${params.id}:`, error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
