import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllProviders } from '@/lib/integrations/registry'

/**
 * Route: GET /api/integrations/categories
 * Returns all integration categories with counts.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const providers = getAllProviders()

        const categoryCounts: Record<string, number> = {}

        providers.forEach(provider => {
            const category = provider.category || 'Other'
            categoryCounts[category] = (categoryCounts[category] || 0) + 1
        })

        const categories = Object.entries(categoryCounts).map(([name, count]) => ({
            name,
            count
        }))

        return NextResponse.json({ categories })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
