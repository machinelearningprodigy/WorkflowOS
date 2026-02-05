// Disconnect integration API - Disconnect integration
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integrationId = params.id;

    // Delete integration connection
    await prisma.integrationConnection.deleteMany({
        where: {
            integrationId,
            userId,
        },
    });

    return NextResponse.json({ success: true });
}
