
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/integrations/[id]/disconnect
 * Disconnect an integration.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Params.id could be the connection ID or provider name. 
        // Assuming provider name for consistency with connect, but ID is safer.
        // Let's assume it's the Provider Name for this MVP path, or handle both.

        await prisma.integrationConnection.deleteMany({
            where: {
                userId: user.id,
                provider: params.id
            }
        })

        return NextResponse.json({ message: 'Disconnected' })
    } catch (error: any) {
        logger.error('Disconnect integration failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
