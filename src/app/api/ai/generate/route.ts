import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateWorkflowFromPrompt } from '@/lib/services/ai.service'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/ai/generate
 * Generates a workflow from a natural language prompt using AI.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { prompt } = body

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({
                error: 'Valid prompt is required'
            }, { status: 400 })
        }

        logger.info(`AI workflow generation requested by ${user.id}: "${prompt.substring(0, 50)}..."`)

        const workflow = await generateWorkflowFromPrompt(prompt, user.id)

        return NextResponse.json({
            success: true,
            workflow: {
                name: workflow.name,
                description: workflow.description,
                steps: workflow.steps
            }
        })
    } catch (error: any) {
        logger.error('AI generation failed:', error.message)
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate workflow'
        }, { status: 500 })
    }
}
