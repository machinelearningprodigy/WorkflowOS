
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/settings/security
 * Get security audit log (recent activity) for settings page.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const recentLogins = await prisma.auditLog.findMany({
            where: {
                userId: user.id,
                action: { contains: 'login' }
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ recentLogins })
    } catch (error: any) {
        logger.error('Fetch security logs failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
