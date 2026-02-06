
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/workflows/[id]/versions
 * List workflow versions.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Assuming we store versions in a separate table or using Temporal capability
        // For now, return empty list or mock

        const versions = await prisma.workflowVersion.findMany({
            where: { workflowId: params.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        return NextResponse.json(versions)
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: POST /api/workflows/[id]/versions
 * Create a new version/snapshot.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { label } = await request.json()

        const workflow = await prisma.workflow.findUnique({
            where: { id: params.id }
        })

        if (!workflow) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const version = await prisma.workflowVersion.create({
            data: {
                workflowId: params.id,
                definition: {}, // Capture current steps/config
                label
            }
        })

        return NextResponse.json(version)
    } catch (error: any) {
        logger.error('Create version failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
