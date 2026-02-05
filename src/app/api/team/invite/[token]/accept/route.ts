// Team accept invite API - Accept team invitation
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: { token: string } }
) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = params;

    // Find invitation
    const invitation = await prisma.teamInvitation.findUnique({
        where: { token },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 });
    }

    // Create team member
    await prisma.teamMember.create({
        data: {
            userId,
            organizationId: invitation.organizationId,
            role: invitation.role,
        },
    });

    // Delete invitation
    await prisma.teamInvitation.delete({
        where: { id: invitation.id },
    });

    return NextResponse.json({ success: true });
}
