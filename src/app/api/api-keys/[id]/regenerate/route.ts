
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/api-keys/[id]/regenerate
 * Regenerate an API key.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const key = await prisma.apiKey.findUnique({
            where: { id: params.id, userId: user.id }
        })

        if (!key) {
            return NextResponse.json({ error: 'API Key not found' }, { status: 404 })
        }

        // Generate new key string
        const newKeyString = 'sk_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)

        const updatedKey = await prisma.apiKey.update({
            where: { id: params.id },
            data: {
                key: newKeyString, // In prod: hash this!
                lastUsedAt: null
            }
        })

        return NextResponse.json({
            id: updatedKey.id,
            name: updatedKey.name,
            key: newKeyString // Only show once
        })
    } catch (error: any) {
        logger.error('Regenerate API key failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
