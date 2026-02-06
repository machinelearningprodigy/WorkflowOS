import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/templates
 * Lists all available workflow templates with optional filtering.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = request.nextUrl
        const category = searchParams.get('category')
        const search = searchParams.get('search')

        const templates = await prisma.workflowTemplate.findMany({
            where: {
                ...(category && { category }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                })
            },
            orderBy: { popularity: 'desc' }
        }).catch(() => {
            // If table doesn't exist, return mock templates
            return getMockTemplates()
        })

        // Get unique categories
        const categories = [...new Set(templates.map(t => t.category))]

        return NextResponse.json({
            templates,
            categories
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// Mock templates for development
function getMockTemplates() {
    return [
        {
            id: '1',
            name: 'Email to Slack Notification',
            description: 'Forward important emails to a Slack channel',
            category: 'Communication',
            popularity: 100,
            steps: []
        },
        {
            id: '2',
            name: 'Lead Capture to CRM',
            description: 'Automatically add form submissions to your CRM',
            category: 'Sales',
            popularity: 95,
            steps: []
        },
        {
            id: '3',
            name: 'Invoice Generation',
            description: 'Generate and send invoices when orders are completed',
            category: 'Finance',
            popularity: 80,
            steps: []
        }
    ]
}
