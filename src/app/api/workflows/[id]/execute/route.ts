// Execute workflow API - Manually trigger workflow execution
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { queueWorkflowExecution } from '@/lib/services/queue.service';

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

    // Verify workflow belongs to user
    const workflow = await prisma.workflow.findFirst({
        where: { id: workflowId, userId },
    });

    if (!workflow) {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Queue workflow execution
    const job = await queueWorkflowExecution({
        workflowId,
        userId,
        input: body.input || {},
    });

    return NextResponse.json({
        success: true,
        jobId: job.id,
        message: 'Workflow execution queued',
    });
}
