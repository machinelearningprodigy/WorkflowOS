import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { getAllProviders } from '@/lib/integrations/registry'

/**
 * Route: POST /api/search
 * Global search across workflows, integrations, and templates.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { query, filters } = body

        if (!query || query.length < 2) {
            return NextResponse.json({
                error: 'Query must be at least 2 characters'
            }, { status: 400 })
        }

        const results: any[] = []
        const searchTerm = query.toLowerCase()

        // Search workflows
        if (!filters?.type || filters.type === 'workflow') {
            const workflows = await prisma.workflow.findMany({
                where: {
                    creatorId: user.id,
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } }
                    ],
                    ...(filters?.status && { status: filters.status })
                },
                take: 10,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true
                }
            })

            results.push(...workflows.map(w => ({
                type: 'workflow',
                id: w.id,
                name: w.name,
                description: w.description,
                status: w.status,
                url: `/dashboard/workflows/${w.id}`
            })))
        }

        // Search integrations
        if (!filters?.type || filters.type === 'integration') {
            const providers = getAllProviders()
            const matchingIntegrations = providers
                .filter(p =>
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm)
                )
                .slice(0, 10)
                .map(p => ({
                    type: 'integration',
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    category: p.category,
                    url: `/dashboard/integrations/${p.id}`
                }))

            results.push(...matchingIntegrations)
        }

        // Search templates (if implemented)
        if (!filters?.type || filters.type === 'template') {
            const templates = await prisma.workflowTemplate.findMany({
                where: {
                    OR: [
                        { name: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } }
                    ]
                },
                take: 10,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true
                }
            }).catch(() => []) // Gracefully handle if table doesn't exist

            results.push(...templates.map(t => ({
                type: 'template',
                id: t.id,
                name: t.name,
                description: t.description,
                category: t.category,
                url: `/dashboard/templates/${t.id}`
            })))
        }

        return NextResponse.json({
            query,
            results,
            total: results.length
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
