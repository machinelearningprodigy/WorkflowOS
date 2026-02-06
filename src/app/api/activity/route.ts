import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Route: GET /api/activity
 * Returns recent activity timeline for the user's organization.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = request.nextUrl
        const limit = parseInt(searchParams.get('limit') || '50')

        // Fetch workflow runs via Supabase
        const { data: runs, error: runsError } = await supabase
            .from('workflow_runs')
            .select(`
                id, 
                status, 
                started_at, 
                completed_at, 
                duration_ms, 
                workflow_id,
                workflow:workflows(name)
            `)
            .order('started_at', { ascending: false })
            .limit(limit);

        if (runsError) throw runsError;

        // Fetch workflow updates
        const { data: workflows, error: wfError } = await supabase
            .from('workflows')
            .select('id, name, is_active, created_at, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(20);

        if (wfError) throw wfError;

        // Combine and format activities
        const activities = [
            ...(runs || []).map((run: any) => ({
                id: run.id,
                type: 'workflow_execution',
                description: `Workflow "${run.workflow?.name || 'Unknown'}" ${run.status}`,
                status: run.status,
                timestamp: run.started_at,
                metadata: {
                    workflowId: run.workflow_id,
                    duration: run.duration_ms
                }
            })),
            ...(workflows || []).map((wf: any) => ({
                id: wf.id,
                type: 'workflow_update',
                description: `Workflow "${wf.name}" updated`,
                status: wf.is_active ? 'active' : 'paused',
                timestamp: wf.updated_at,
                metadata: {
                    workflowId: wf.id
                }
            }))
        ]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit)

        return NextResponse.json({ activities })
    } catch (error: any) {
        console.error('Activity API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
