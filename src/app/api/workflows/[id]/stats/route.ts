
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/workflows/[id]/stats
 * Get statistics for a workflow.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await prisma.workflowRun.groupBy({
        by: ['status'],
        where: { workflowId: params.id },
        _count: { _all: true }
    })

    return NextResponse.json(stats)
}
