// AI generate workflow API - Generate workflow from natural language
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { generateWorkflowFromPrompt } from '@/lib/services/ai.service';

export async function POST(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    try {
        const workflow = await generateWorkflowFromPrompt(prompt, userId);
        return NextResponse.json({ success: true, workflow });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
