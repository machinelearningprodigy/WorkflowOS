// Duplicate workflow API - Clone existing workflow
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

    // Get original workflow
    const original = await prisma.workflow.findFirst({
        where: { id: workflowId, userId },
        include: { steps: true },
    });

    if (!original) {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    // Create duplicate
    const duplicate = await prisma.workflow.create({
        data: {
            name: `${original.name} (Copy)`,
            description: original.description,
            userId,
            trigger: original.trigger,
            steps: {
                create: original.steps.map((step) => ({
                    name: step.name,
                    type: step.type,
                    config: step.config,
                    order: step.order,
                })),
            },
        },
        include: { steps: true },
    });

    return NextResponse.json({ success: true, workflow: duplicate });
}
