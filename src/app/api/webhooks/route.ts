
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/webhooks
 * List created webhooks.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const webhooks = await prisma.webhookEndpoint.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(webhooks)

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
