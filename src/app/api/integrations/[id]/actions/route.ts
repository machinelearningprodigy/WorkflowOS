import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getProvider } from '@/lib/integrations/registry'

/**
 * Route: GET /api/integrations/[id]/actions
 * Returns available actions for an integration provider.
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
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
        }

        const actions = provider.getActions().map(action => ({
            id: action.id,
            name: action.name,
            description: action.description,
            inputs: action.inputs,
            outputs: action.outputs
        }))

        return NextResponse.json({ actions })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
