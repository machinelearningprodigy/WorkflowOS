// Workflow runs API - Get execution history
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
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get workflow runs
    const runs = await prisma.workflowRun.findMany({
        where: { workflowId, workflow: { userId } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
            logs: true,
        },
    });

    const total = await prisma.workflowRun.count({
        where: { workflowId, workflow: { userId } },
    });

    return NextResponse.json({
        runs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}
