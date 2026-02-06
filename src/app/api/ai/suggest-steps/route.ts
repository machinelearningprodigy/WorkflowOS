import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllProviders } from '@/lib/integrations/registry'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/ai/suggest-steps
 * Suggests next steps for a workflow based on current configuration.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { currentSteps, context } = body

        if (!Array.isArray(currentSteps)) {
            return NextResponse.json({
                error: 'currentSteps must be an array'
            }, { status: 400 })
        }

        const providers = getAllProviders()
        const suggestions = []

        // Analyze current steps to suggest next actions
        const lastStep = currentSteps[currentSteps.length - 1]

        if (!lastStep) {
            // No steps yet - suggest common starting points
            suggestions.push(
                {
                    provider: 'webhook',
                    action: 'receive',
                    description: 'Start with a webhook trigger to receive data from external sources',
                    category: 'trigger',
                    confidence: 0.9
                },
                {
                    provider: 'schedule',
                    action: 'cron',
                    description: 'Schedule this workflow to run at specific times',
                    category: 'trigger',
                    confidence: 0.8
                },
                {
                    provider: 'email',
                    action: 'receive',
                    description: 'Trigger on incoming emails',
                    category: 'trigger',
                    confidence: 0.7
                }
            )
        } else {
            // Suggest based on last step
            const lastProvider = lastStep.provider

            if (lastProvider === 'email' && lastStep.action === 'receive') {
                suggestions.push(
                    {
                        provider: 'slack',
                        action: 'send_message',
                        description: 'Send email content to Slack channel',
                        category: 'notification',
                        confidence: 0.85
                    },
                    {
                        provider: 'google-sheets',
                        action: 'append_row',
                        description: 'Log email data to Google Sheets',
                        category: 'data',
                        confidence: 0.8
                    }
                )
            } else if (lastProvider === 'google-sheets') {
                suggestions.push(
                    {
                        provider: 'email',
                        action: 'send',
                        description: 'Send email notification with spreadsheet data',
                        category: 'notification',
                        confidence: 0.8
                    },
                    {
                        provider: 'airtable',
                        action: 'create_record',
                        description: 'Sync data to Airtable',
                        category: 'data',
                        confidence: 0.75
                    }
                )
            } else {
                // Generic suggestions
                suggestions.push(
                    {
                        provider: 'condition',
                        action: 'if',
                        description: 'Add conditional logic to branch your workflow',
                        category: 'logic',
                        confidence: 0.7
                    },
                    {
                        provider: 'delay',
                        action: 'wait',
                        description: 'Add a delay before the next action',
                        category: 'utility',
                        confidence: 0.6
                    },
                    {
                        provider: 'email',
                        action: 'send',
                        description: 'Send notification email',
                        category: 'notification',
                        confidence: 0.75
                    }
                )
            }
        }

        logger.info(`Step suggestions generated for workflow with ${currentSteps.length} steps`)

        return NextResponse.json({
            success: true,
            suggestions: suggestions.slice(0, 5), // Top 5 suggestions
            totalSuggestions: suggestions.length
        })
    } catch (error: any) {
        logger.error('Step suggestion failed:', error.message)
        return NextResponse.json({
            error: 'Failed to generate step suggestions'
        }, { status: 500 })
    }
}
