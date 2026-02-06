
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'

/**
 * Route: POST /api/team/invite/[token]/accept
 * Accept a team invitation.
 */
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const invite = await prisma.teamInvite.findUnique({
            where: { token: params.token }
        })

        if (!invite || invite.expiresAt < new Date()) {
            return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })
        }

        // Add user to organization
        await prisma.organizationMember.create({
            data: {
                userId: user.id,
                organizationId: invite.organizationId,
                role: invite.role
            }
        })

        // Delete invite
        await prisma.teamInvite.delete({ where: { id: invite.id } })

        return NextResponse.json({ message: 'Invitation accepted' })
    } catch (error: any) {
        logger.error('Accept invite failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
