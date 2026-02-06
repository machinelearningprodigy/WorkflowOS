import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

/**
 * Route: GET /api/team
 * Lists all team members for the user's organization.
 */
export async function GET(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // In production, fetch orgId from user's org membership
        const orgId = user.id // Simplified for now

        const members = await prisma.orgMember.findMany({
            where: { orgId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json(members.map(m => ({
            id: m.id,
            userId: m.userId,
            role: m.role,
            status: m.status,
            joinedAt: m.createdAt,
            user: m.user
        })))
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
