import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { validation } from '@/utils/validation'

/**
 * Route: GET /api/workflows
 * Lists all workflows for the authenticated user.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const workflows = await prisma.workflow.findMany({
            where: { creatorId: user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { runs: true }
                }
            }
        })

        return NextResponse.json(workflows)
    } catch (error: any) {
        logger.error('Failed to fetch workflows:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: POST /api/workflows
 * Creates a new workflow.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, description } = body

        // Validate
        const validName = validation.workflowName.safeParse(name)
        if (!validName.success) {
            return NextResponse.json({ error: validName.error.errors[0].message }, { status: 400 })
        }

        const workflow = await prisma.workflow.create({
            data: {
                name,
                description,
                creatorId: user.id,
                status: 'draft',
                webhookSlug: Math.random().toString(36).substring(2, 12),
            }
        })

        logger.info(`Workflow created: ${workflow.id} by ${user.id}`)
        return NextResponse.json(workflow, { status: 201 })
    } catch (error: any) {
        logger.error('Workflow creation failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
