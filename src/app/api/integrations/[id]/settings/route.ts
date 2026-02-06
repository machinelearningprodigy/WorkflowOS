import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: PATCH /api/integrations/[id]/settings
 * Updates integration settings.
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const providerId = params.id

    try {
        const body = await request.json()
        const { settings } = body

        const orgId = user.id

        // Update credential settings
        const credential = await prisma.orgCredential.updateMany({
            where: {
                orgId,
                providerId
            },
            data: {
                settings: settings || {},
                updatedAt: new Date()
            }
        })

        if (credential.count === 0) {
            return NextResponse.json({
                error: 'Integration not found'
            }, { status: 404 })
        }

        logger.info(`Integration settings updated: ${providerId}`)

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully'
        })
    } catch (error: any) {
        logger.error(`Failed to update integration settings for ${providerId}:`, error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
