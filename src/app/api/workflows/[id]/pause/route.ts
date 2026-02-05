// Pause workflow API - Pause/resume workflow
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workflowId = params.id;
    const body = await request.json();
    const { paused } = body;

    // Update workflow status
    const workflow = await prisma.workflow.update({
        where: { id: workflowId, userId },
        data: { isPaused: paused },
    });

    return NextResponse.json({ success: true, workflow });
}
