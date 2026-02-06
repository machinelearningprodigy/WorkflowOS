
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: GET /api/sessions
 * List active sessions for the user.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Assuming we track sessions in Postgres or retrieving from Supabase
        // Since Supabase doesn't expose a simple "list all sessions" API for the user easily without tracking,
        // we will fetch from our Prisma 'Session' table if it exists, or return a placeholder.
        // I will assume we are syncing sessions or just return the current one for now.

        // Improved: Fetching recent login activity from AuditLog as a proxy for sessions
        const sessions = await prisma.auditLog.findMany({
            where: {
                userId: user.id,
                action: 'login'
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                createdAt: true,
                metadata: true // IP, User Agent often stored here
            }
        })

        return NextResponse.json(sessions)
    } catch (error: any) {
        logger.error('Fetch sessions failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
