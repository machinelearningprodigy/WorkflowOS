
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/utils/logger'
import axios from 'axios'
import { prisma } from '@/lib/db'

/**
 * Route: POST /api/webhooks/[id]/test
 * Send a test payload to the configured webhook URL.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const webhook = await prisma.webhookEndpoint.findUnique({
            where: { id: params.id, userId: user.id }
        })

        if (!webhook) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const payload = {
            event: 'test.ping',
            timestamp: new Date().toISOString(),
            data: { message: 'This is a test event from WorkflowOS' }
        }

        try {
            await axios.post(webhook.url, payload, { timeout: 5000 })
            return NextResponse.json({ success: true, message: 'Ping sent successfully' })
        } catch (reqError: any) {
            return NextResponse.json({
                success: false,
                error: reqError.message,
                status: reqError.response?.status
            }, { status: 400 })
        }

    } catch (error: any) {
        logger.error('Test webhooks failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
