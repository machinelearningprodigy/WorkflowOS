
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route: POST /api/workflows/[id]/pause
 * Pause a workflow.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.workflow.update({
        where: { id: params.id, creatorId: user.id },
        data: { status: 'paused' }
    })

    return NextResponse.json({ message: 'Workflow paused' })
}
