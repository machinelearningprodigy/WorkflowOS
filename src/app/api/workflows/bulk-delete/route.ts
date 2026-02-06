
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/workflows/bulk-delete
 * Delete multiple workflows.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { ids } = await request.json()

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'IDs array required' }, { status: 400 })
        }

        await prisma.workflow.deleteMany({
            where: {
                id: { in: ids },
                creatorId: user.id
            }
        })

        return NextResponse.json({ message: 'Workflows deleted' })
    } catch (error: any) {
        logger.error('Bulk delete workflows failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
