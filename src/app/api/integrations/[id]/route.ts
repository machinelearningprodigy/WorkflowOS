import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProvider } from '@/lib/integrations/registry'

/**
 * Route: GET /api/integrations/[id]
 * Get details for a specific integration provider.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const provider = getProvider(params.id)

        if (!provider) {
            return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: provider.id,
            name: provider.name,
            description: provider.description,
            category: provider.category,
            icon: provider.icon,
            authType: provider.authType,
            actions: provider.getActions().map(a => ({
                id: a.id,
                name: a.name,
                description: a.description,
                inputSchema: a.inputSchema
            })),
            triggers: provider.getTriggers().map(t => ({
                id: t.id,
                name: t.name,
                description: t.description,
                outputSchema: t.outputSchema
            }))
        })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
