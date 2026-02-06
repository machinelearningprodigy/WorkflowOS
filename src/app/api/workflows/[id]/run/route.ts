import { createClient } from '@/lib/supabase/server'
import { WorkflowEngine } from '@/lib/workflow-engine/core'
import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const engine = new WorkflowEngine()
        const result = await engine.runWorkflow(params.id)

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('[WORKFLOW_RUN]', error)
        return new NextResponse(error.message || 'Internal Error', { status: 500 })
    }
}
