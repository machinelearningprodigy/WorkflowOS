// API key revoke API - Revoke API key
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

    const keyId = params.id;

    // Delete API key
    await prisma.apiKey.delete({
        where: { id: keyId, userId },
    });

    return NextResponse.json({ success: true });
}
