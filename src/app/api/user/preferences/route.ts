
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/user/preferences
 * Get user preference settings.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const prefs = await prisma.userSettings.findUnique({
            where: { userId: user.id }
        })

        return NextResponse.json(prefs || { theme: 'system', language: 'en' })
    } catch (error: any) {
        logger.error('Fetch preferences failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: POST /api/user/preferences
 * Update user preference settings.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        const prefs = await prisma.userSettings.upsert({
            where: { userId: user.id },
            update: { ...body },
            create: { userId: user.id, ...body }
        })

        return NextResponse.json(prefs)
    } catch (error: any) {
        logger.error('Update preferences failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
