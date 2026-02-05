// Team remove member API - Remove team member
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memberId = params.id;

    // Verify user is admin/owner
    const member = await prisma.teamMember.findFirst({
        where: { userId },
        include: { organization: true },
    });

    if (!member || !['admin', 'owner'].includes(member.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove team member
    await prisma.teamMember.delete({
        where: { id: memberId },
    });

    return NextResponse.json({ success: true });
}
