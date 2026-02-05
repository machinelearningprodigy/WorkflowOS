// Refresh token API - Refresh OAuth tokens
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { refreshOAuthToken } from '@/lib/services/oauth.service';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integrationId = params.id;

    try {
        await refreshOAuthToken(userId, integrationId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 400 });
    }
}
