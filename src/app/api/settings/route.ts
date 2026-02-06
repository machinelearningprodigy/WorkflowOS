
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/settings
 * Get user settings.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const settings = await prisma.userSettings.findUnique({
            where: { userId: user.id }
        })

        if (!settings) {
            // Return defaults if no settings found
            return NextResponse.json({
                theme: 'system',
                notifications: {
                    email: true,
                    push: false
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error: any) {
        logger.error('Fetch settings failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: POST /api/settings
 * Update user settings.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        const settings = await prisma.userSettings.upsert({
            where: { userId: user.id },
            update: { ...body },
            create: {
                userId: user.id,
                ...body
            }
        })

        return NextResponse.json(settings)
    } catch (error: any) {
        logger.error('Update settings failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
