// AI optimize workflow API - Get AI suggestions for workflow optimization
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { optimizeWorkflow } from '@/lib/services/ai.service';

export async function POST(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workflowId } = body;

    try {
        const suggestions = await optimizeWorkflow(workflowId, userId);
        return NextResponse.json({ success: true, suggestions });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
