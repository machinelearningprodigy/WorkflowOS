import { BaseProvider, Action, TokenResponse } from "../base.provider";

export class GoogleYouTubeProvider extends BaseProvider {
    name = "YouTube";
    type = "VIDEO";
    public slug = 'youtube';

    private clientId = process.env.GOOGLE_CLIENT_ID;
    private clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    private scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.force-ssl'
    ];

    override isConfigured(): boolean {
        return !!this.clientId && !!this.clientSecret;
    }

    getAuthUrl(redirectUri: string, state: string, overrides?: { clientId?: string }): string {
        const clientId = (overrides?.clientId || this.clientId) as string;
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: this.scopes.join(' '),
            access_type: 'offline',
            prompt: 'consent',
            state,
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string, overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        const clientId = (overrides?.clientId || this.clientId) as string;
        const clientSecret = (overrides?.clientSecret || this.clientSecret) as string;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error_description || data.error || 'Failed to exchange code for token');

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            scope: data.scope,
            providerUserId: 'me',
        };
    }

    async refreshAccessToken(refreshToken: string, overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        const clientId = (overrides?.clientId || this.clientId) as string;
        const clientSecret = (overrides?.clientSecret || this.clientSecret) as string;

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'refresh_token',
            }),
        });

        const data = await response.json();
        return {
            accessToken: data.access_token,
            expiresIn: data.expires_in,
        };
    }

    async testConnection(accessToken: string): Promise<boolean> {
        try {
            const response = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: "list_videos",
                name: "List My Videos",
                description: "Retrieves a list of videos in your channel.",
                inputs: [
                    { id: "maxResults", name: "Max Results", type: "number", required: false }
                ]
            }
        ];
    }
}
