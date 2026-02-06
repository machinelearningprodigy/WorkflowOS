
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/api-keys
 * List API keys.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const keys = await prisma.apiKey.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })

        // Mask keys in response
        const masked = keys.map(k => ({
            ...k,
            key: `${k.key.substring(0, 4)}...${k.key.substring(k.key.length - 4)}`
        }))

        return NextResponse.json(masked)
    } catch (error: any) {
        logger.error('Fetch API keys failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
