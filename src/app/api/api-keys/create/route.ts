
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/api-keys/create
 * Create a new API key.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name } = await request.json()

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const keyString = 'sk_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)

        const apiKey = await prisma.apiKey.create({
            data: {
                name,
                key: keyString, // In prod: Store hashed version, return raw only once
                userId: user.id
            }
        })

        return NextResponse.json(apiKey, { status: 201 })
    } catch (error: any) {
        logger.error('Create API key failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
