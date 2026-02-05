// Team invite API - Invite team member
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/services/email.service';

export async function POST(request: NextRequest) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role } = body;

    // Create invitation
    const invitation = await prisma.teamInvitation.create({
        data: {
            email,
            role,
            invitedBy: userId,
            token: generateInviteToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    });

    // Send invitation email
    await sendEmail({
        to: email,
        template: 'team-invite',
        data: {
            inviterName: user.name,
            role,
            inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${invitation.token}`,
        },
    });

    return NextResponse.json({ success: true, invitation });
}

function generateInviteToken(): string {
    return crypto.randomBytes(32).toString('hex');
}
