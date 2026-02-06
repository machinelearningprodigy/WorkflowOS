import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { refreshOAuthToken } from '@/lib/services/oauth.service';

export async function POST(
    request: NextRequest,
    params: { params: Promise<{ id: string }> }
) {
    const { id } = await params.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await refreshOAuthToken(user.id, id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 400 });
    }
}

