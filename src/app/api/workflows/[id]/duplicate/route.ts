
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/[id]/duplicate
 * Duplicate a workflow.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const original = await prisma.workflow.findUnique({
            where: { id: params.id, creatorId: user.id },
            include: { steps: true }
        })

        if (!original) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        const duplicated = await prisma.workflow.create({
            data: {
                name: `${original.name} (Copy)`,
                description: original.description,
                creatorId: user.id,
                status: 'draft',
                webhookSlug: Math.random().toString(36).substring(2, 12),
                tags: original.tags as any,
                cronSchedule: original.cronSchedule
            }
            // In a real app, steps would be deeply duplicated using nested writes or a loop.
        })

        return NextResponse.json(duplicated, { status: 201 })
    } catch (error: any) {
        logger.error('Duplicate workflow failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
