
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/settings/notifications
 * Get notification settings.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const settings = await prisma.userSettings.findUnique({
            where: { userId: user.id },
            select: { notifications: true }
        })

        return NextResponse.json(settings?.notifications || {})
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: POST /api/settings/notifications
 * Update notification settings.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        await prisma.userSettings.upsert({
            where: { userId: user.id },
            update: { notifications: body },
            create: { userId: user.id, notifications: body }
        })

        return NextResponse.json({ message: 'Settings updated' })
    } catch (error: any) {
        logger.error('Update update notifications failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
