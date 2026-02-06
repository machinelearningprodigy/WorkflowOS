import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllProviders } from '@/lib/integrations/registry'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/ai/suggest-integrations
 * Suggests relevant integrations based on workflow description and industry.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { workflowDescription, industry, goal } = body

        const providers = getAllProviders()
        const suggestions = []

        // Industry-specific recommendations
        const industryMap: Record<string, string[]> = {
            'ecommerce': ['stripe', 'shopify', 'woocommerce', 'mailchimp'],
            'marketing': ['mailchimp', 'hubspot', 'google-analytics', 'facebook'],
            'sales': ['salesforce', 'hubspot', 'pipedrive', 'slack'],
            'support': ['zendesk', 'intercom', 'slack', 'email'],
            'finance': ['stripe', 'quickbooks', 'xero', 'paypal'],
            'hr': ['bamboohr', 'slack', 'google-calendar', 'email'],
            'development': ['github', 'jira', 'slack', 'linear']
        }

        // Goal-based recommendations
        const goalMap: Record<string, string[]> = {
            'automation': ['zapier', 'webhook', 'schedule'],
            'communication': ['slack', 'email', 'twilio', 'whatsapp'],
            'data_sync': ['google-sheets', 'airtable', 'notion', 'database'],
            'notifications': ['slack', 'email', 'sms', 'push'],
            'analytics': ['google-analytics', 'mixpanel', 'amplitude']
        }

        // Get relevant providers based on industry
        const industryProviders = industry ? industryMap[industry.toLowerCase()] || [] : []
        const goalProviders = goal ? goalMap[goal.toLowerCase()] || [] : []

        const relevantProviderIds = [...new Set([...industryProviders, ...goalProviders])]

        // Score and rank providers
        providers.forEach(provider => {
            let score = 0
            let reason = ''

            // Check if provider matches industry
            if (industryProviders.includes(provider.id)) {
                score += 0.5
                reason = `Commonly used in ${industry} industry`
            }

            // Check if provider matches goal
            if (goalProviders.includes(provider.id)) {
                score += 0.3
                reason = reason ? `${reason}. Helps achieve ${goal} goals` : `Helps achieve ${goal} goals`
            }

            // Check if description mentions provider
            if (workflowDescription && workflowDescription.toLowerCase().includes(provider.name.toLowerCase())) {
                score += 0.4
                reason = reason ? `${reason}. Mentioned in workflow description` : 'Relevant to your workflow description'
            }

            // Add popular integrations
            if (['slack', 'email', 'google-sheets', 'webhook'].includes(provider.id)) {
                score += 0.2
                reason = reason || 'Popular integration for automation'
            }

            if (score > 0) {
                suggestions.push({
                    id: provider.id,
                    name: provider.name,
                    description: provider.description,
                    category: provider.category,
                    score,
                    reason: reason || 'Recommended based on your workflow',
                    actions: provider.getActions().length,
                    triggers: provider.getTriggers().length
                })
            }
        })

        // Sort by score and return top suggestions
        suggestions.sort((a, b) => b.score - a.score)

        logger.info(`Integration suggestions generated for ${industry || 'general'} industry`)

        return NextResponse.json({
            success: true,
            suggestions: suggestions.slice(0, 8),
            totalSuggestions: suggestions.length
        })
    } catch (error: any) {
        logger.error('Integration suggestion failed:', error.message)
        return NextResponse.json({
            error: 'Failed to generate integration suggestions'
        }, { status: 500 })
    }
}
