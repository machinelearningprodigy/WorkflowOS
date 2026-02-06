
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/workflows/[id]/runs/[runId]
 * Get details of a specific workflow run.
 */
export async function GET(request: NextRequest, { params }: { params: { id: string, runId: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const run = await prisma.workflowRun.findUnique({
            where: { id: params.runId },
            include: {
                logs: true
            }
        })

        if (!run) {
            return NextResponse.json({ error: 'Run not found' }, { status: 404 })
        }

        return NextResponse.json(run)
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
