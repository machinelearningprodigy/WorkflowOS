import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getProvider } from '@/lib/integrations/registry';

export async function GET(
    request: NextRequest,
    { params }: { params: { provider: string } }
) {
    const { provider: providerSlug } = params;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=${error}`);
    }

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=no_code`);
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const provider = getProvider(providerSlug);
    if (!provider) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=invalid_provider`);
    }

    try {
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/callback/${providerSlug}`;
        const tokens = await provider.exchangeCodeForTokens(code, redirectUri);

        const { error: upsertError } = await supabase
            .from('connections')
            .upsert({
                user_id: user.id,
                provider_slug: providerSlug,
                display_name: `${provider.name} Connection`,
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
                expires_at: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
                scopes: tokens.scope ? tokens.scope.split(' ') : [],
                account_id: tokens.providerUserId,
                status: 'connected',
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,provider_slug,account_id'
            });

        if (upsertError) throw upsertError;

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?success=connected`);
    } catch (err: any) {
        console.error('Integration Connection Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/integrations?error=${encodeURIComponent(err.message)}`);
    }
}
