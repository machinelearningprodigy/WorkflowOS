
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/utils/logger'
import { resend } from '@/lib/resend'

/**
 * Route: POST /api/team/invite/[token]/resend
 * Resend a team invitation.
 */
export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const invite = await prisma.teamInvite.findUnique({
            where: { token: params.token },
            include: { organization: true }
        })

        if (!invite) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
        }

        // Logic to send email using Resend
        await resend.emails.send({
            from: 'WorkflowOS <noreply@workflowos.dev>',
            to: invite.email,
            subject: `You've been invited to join ${invite.organization.name}`,
            html: `<p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/${invite.token}">here</a> to join.</p>`
        })

        return NextResponse.json({ message: 'Invitation sent' })
    } catch (error: any) {
        logger.error('Resend invite failed:', error.message)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
