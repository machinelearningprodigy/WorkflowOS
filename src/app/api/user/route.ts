import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/user
 * Returns the current user's profile information.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!profile) {
            // Create profile if it doesn't exist
            const newProfile = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
                }
            })
            return NextResponse.json(newProfile)
        }

        return NextResponse.json(profile)
    } catch (error: any) {
        logger.error('Failed to fetch user profile:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Route: PATCH /api/user
 * Updates the current user's profile.
 */
export async function PATCH(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, avatarUrl } = body

        const updatedProfile = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(name && { name }),
                ...(avatarUrl && { avatarUrl }),
                updatedAt: new Date()
            }
        })

        logger.info(`User profile updated: ${user.id}`)

        return NextResponse.json(updatedProfile)
    } catch (error: any) {
        logger.error('Failed to update user profile:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
