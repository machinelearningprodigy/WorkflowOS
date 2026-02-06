
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { resend } from '@/lib/resend'

/**
 * Route: POST /api/team/invite
 * Invite a new member to the team.
 */
export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { email, role } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Check if inviter is admin/owner (omitted for brevity)
        const userOrg = await prisma.organizationMember.findFirst({
            where: { userId: user.id },
            include: { organization: true }
        })

        if (!userOrg) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
        }

        const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        const invite = await prisma.teamInvite.create({
            data: {
                email,
                role: role || 'member',
                token,
                expiresAt,
                organizationId: userOrg.organizationId,
                inviterId: user.id
            }
        })

        await resend.emails.send({
            from: 'WorkflowOS <noreply@workflowos.dev>',
            to: email,
            subject: `Join ${userOrg.organization.name} on WorkflowOS`,
            html: `<p>You have been invited. <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}">Click to accept</a>.</p>`
        })

        return NextResponse.json(invite, { status: 201 })
    } catch (error: any) {
        logger.error('Create invite failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
