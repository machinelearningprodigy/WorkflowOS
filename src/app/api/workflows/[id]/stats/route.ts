// Workflow stats API - Get workflow statistics
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = params.id;

    // Get workflow stats
    const [totalRuns, successfulRuns, failedRuns, avgDuration] = await Promise.all([
        prisma.workflowRun.count({
            where: { workflowId, workflow: { userId } },
        }),
        prisma.workflowRun.count({
            where: { workflowId, workflow: { userId }, status: 'success' },
        }),
        prisma.workflowRun.count({
            where: { workflowId, workflow: { userId }, status: 'failed' },
        }),
        prisma.workflowRun.aggregate({
            where: { workflowId, workflow: { userId }, status: 'success' },
            _avg: { duration: true },
        }),
    ]);

    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    return NextResponse.json({
        totalRuns,
        successfulRuns,
        failedRuns,
        successRate,
        avgDuration: avgDuration._avg.duration || 0,
    });
}
