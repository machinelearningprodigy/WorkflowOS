// Analytics dashboard API - Get analytics data
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const range = searchParams.get('range') || '30d'; // 7d, 30d, 90d, 1y

    const startDate = getStartDate(range);

    // Get workflow runs over time
    const runs = await prisma.workflowRun.groupBy({
        by: ['status'],
        where: {
            workflow: { userId },
            createdAt: { gte: startDate },
        },
        _count: true,
    });

    // Calculate time saved (assuming 5 min per manual task)
    const totalRuns = runs.reduce((sum, r) => sum + r._count, 0);
    const timeSavedMinutes = totalRuns * 5;

    // Get top workflows
    const topWorkflows = await prisma.workflow.findMany({
        where: { userId },
        include: {
            _count: {
                select: { runs: true },
            },
        },
        orderBy: {
            runs: {
                _count: 'desc',
            },
        },
        take: 5,
    });

    return NextResponse.json({
        timeSaved: timeSavedMinutes,
        totalRuns,
        successRate: calculateSuccessRate(runs),
        topWorkflows,
        runsByStatus: runs,
    });
}

function getStartDate(range: string): Date {
    const now = new Date();
    switch (range) {
        case '7d':
            return new Date(now.setDate(now.getDate() - 7));
        case '30d':
            return new Date(now.setDate(now.getDate() - 30));
        case '90d':
            return new Date(now.setDate(now.getDate() - 90));
        case '1y':
            return new Date(now.setFullYear(now.getFullYear() - 1));
        default:
            return new Date(now.setDate(now.getDate() - 30));
    }
}

function calculateSuccessRate(runs: any[]): number {
    const total = runs.reduce((sum, r) => sum + r._count, 0);
    const successful = runs.find(r => r.status === 'success')?._count || 0;
    return total > 0 ? (successful / total) * 100 : 0;
}
