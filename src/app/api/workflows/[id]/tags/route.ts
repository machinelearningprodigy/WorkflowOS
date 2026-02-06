
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/workflows/[id]/tags
 * Get tags for a workflow.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const workflow = await prisma.workflow.findUnique({
            where: { id: params.id, creatorId: user.id },
            select: { tags: true }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        return NextResponse.json(workflow.tags)
    } catch (error: any) {
        logger.error('Fetch tags failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: POST /api/workflows/[id]/tags
 * Add a tag to a workflow.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { tag } = await request.json()

        if (!tag) {
            return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
        }

        // Assuming tags is a JSON array or similar. 
        // We will retrieve, check duplicate, and update.
        const workflow = await prisma.workflow.findUnique({
            where: { id: params.id, creatorId: user.id }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        const currentTags: string[] = (workflow.tags as any) || []
        if (!currentTags.includes(tag)) {
            await prisma.workflow.update({
                where: { id: params.id },
                data: {
                    tags: [...currentTags, tag]
                }
            })
        }

        return NextResponse.json({ message: 'Tag added' })
    } catch (error: any) {
        logger.error('Add tag failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: DELETE /api/workflows/[id]/tags
 * Remove a tag from a workflow.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = request.nextUrl
        const tag = searchParams.get('tag')

        if (!tag) {
            return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
        }

        const workflow = await prisma.workflow.findUnique({
            where: { id: params.id, creatorId: user.id }
        })

        if (!workflow) {
            return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        const currentTags: string[] = (workflow.tags as any) || []
        const newTags = currentTags.filter(t => t !== tag)

        await prisma.workflow.update({
            where: { id: params.id },
            data: {
                tags: newTags
            }
        })

        return NextResponse.json({ message: 'Tag removed' })
    } catch (error: any) {
        logger.error('Remove tag failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
