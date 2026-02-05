// Usage API - Get current usage stats
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [workflowCount, runCount, integrationCount] = await Promise.all([
        prisma.workflow.count({ where: { userId } }),
        prisma.workflowRun.count({
            where: {
                workflow: { userId },
                createdAt: {
                    gte: new Date(new Date().setDate(1)), // This month
                },
            },
        }),
        prisma.integrationConnection.count({ where: { userId } }),
    ]);

    // Get subscription limits
    const subscription = await prisma.subscription.findFirst({
        where: { userId, status: 'active' },
        include: { plan: true },
    });

    const limits = subscription?.plan || {
        maxWorkflows: 5,
        maxRuns: 100,
        maxIntegrations: 3,
    };

    return NextResponse.json({
        usage: {
            workflows: workflowCount,
            runs: runCount,
            integrations: integrationCount,
        },
        limits: {
            workflows: limits.maxWorkflows,
            runs: limits.maxRuns,
            integrations: limits.maxIntegrations,
        },
    });
}
