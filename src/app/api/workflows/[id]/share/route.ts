
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/[id]/share
 * Share workflow or change visibility.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { public: isPublic } = await request.json()

        const workflow = await prisma.workflow.update({
            where: { id: params.id, creatorId: user.id },
            data: { isPublic }
        })

        return NextResponse.json(workflow)
    } catch (error: any) {
        logger.error('Share workflow failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
