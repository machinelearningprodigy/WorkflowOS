
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/integrations
 * List available and connected integrations.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Fetch all available definitions (mocked or DB)
        const definitions = [
            { provider: 'gmail', name: 'Gmail', icon: '/icons/gmail.svg' },
            { provider: 'slack', name: 'Slack', icon: '/icons/slack.svg' },
            { provider: 'github', name: 'GitHub', icon: '/icons/github.svg' },
            { provider: 'discord', name: 'Discord', icon: '/icons/discord.svg' },
        ]

        // Fetch user connections
        const connections = await prisma.integrationConnection.findMany({
            where: { userId: user.id }
        })

        // Merge
        const integrations = definitions.map(def => ({
            ...def,
            connected: connections.some(c => c.provider === def.provider),
            connectionId: connections.find(c => c.provider === def.provider)?.id
        }))

        return NextResponse.json(integrations)
    } catch (error: any) {
        logger.error('Fetch integrations failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
