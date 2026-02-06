import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Route: GET /api/dashboard/stats
 * Returns dashboard statistics and recent activity using real Supabase data.
 */
export async function GET(_request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get total workflows
        const { count: workflowCount } = await supabase
            .from('workflows')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        // Get active workflows
        const { count: activeCount } = await supabase
            .from('workflows')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_active', true);

        // Get total runs
        const { count: runCount } = await supabase
            .from('workflow_runs')
            .select('*, workflow:workflows!inner(user_id)', { count: 'exact', head: true })
            .eq('workflows.user_id', user.id);

        // Get successful runs
        const { count: successCount } = await supabase
            .from('workflow_runs')
            .select('*, workflow:workflows!inner(user_id)', { count: 'exact', head: true })
            .eq('workflows.user_id', user.id)
            .eq('status', 'completed');

        // Get average duration
        const { data: durationData } = await supabase
            .from('workflow_runs')
            .select('duration_ms, workflow:workflows!inner(user_id)')
            .eq('workflows.user_id', user.id)
            .not('duration_ms', 'is', null);

        const avgDuration = durationData && durationData.length > 0
            ? durationData.reduce((acc: number, curr: any) => acc + curr.duration_ms, 0) / durationData.length
            : 0;

        // Get recent activity (last 5 runs)
        const { data: recentActivity } = await supabase
            .from('workflow_runs')
            .select(`
                id, 
                status, 
                started_at, 
                duration_ms,
                workflow:workflows (
                    name
                )
            `)
            .order('started_at', { ascending: false })
            .limit(5);

        // Map activity to frontend format
        const formattedActivity = (recentActivity || []).map((run: any) => ({
            id: run.id,
            workflow_name: run.workflow?.name || 'Unknown',
            status: run.status,
            duration_ms: run.duration_ms || 0,
            created_at: run.started_at
        }));

        return NextResponse.json({
            stats: {
                total_workflows: workflowCount || 0,
                active_workflows: activeCount || 0,
                successful_runs: successCount || 0,
                avg_duration_ms: avgDuration,
                total_executions: runCount || 0
            },
            activity: formattedActivity
        })
    } catch (error: any) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
