// Test integration API - Test integration connection
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getIntegrationProvider } from '@/lib/integrations/registry';

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
        const provider = getIntegrationProvider(integrationId);
        const result = await provider.test();

        return NextResponse.json({
            success: true,
            message: 'Integration is working correctly',
            result,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 400 });
    }
}
