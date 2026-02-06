import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: NextRequest,
    params: { params: Promise<{ id: string }> }
) {
    const { id: workflowId } = await params.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get workflow runs
    const runs = await prisma.workflowRun.findMany({
        where: {
            workflowId,
            workflow: { creatorId: user.id },
        },
        orderBy: { startTime: 'desc' }, // Changed from createdAt to startTime based on schema usage in other files
        skip: (page - 1) * limit,
        take: limit,
        include: {
            logs: true,
        },
    });

    const total = await prisma.workflowRun.count({
        where: {
            workflowId,
            workflow: { creatorId: user.id },
        },
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

