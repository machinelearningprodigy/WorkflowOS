
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/webhooks/create
 * Create a new webhook listener.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { url, events, description } = body

        if (!url || !events) {
            return NextResponse.json({ error: 'URL and events are required' }, { status: 400 })
        }

        const webhook = await prisma.webhookEndpoint.create({
            data: {
                url,
                events,
                description,
                userId: user.id
            }
        })

        return NextResponse.json(webhook, { status: 201 })
    } catch (error: any) {
        logger.error('Create webhook failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
