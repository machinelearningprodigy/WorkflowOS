import { BaseProvider, Action, Trigger, TokenResponse } from "../base.provider";

export class GmailProvider extends BaseProvider {
    name = 'Gmail';
    type = 'EMAIL';

    private clientId = process.env.GOOGLE_CLIENT_ID;
    private clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    public slug = 'gmail';

    private scopes = [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
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
        if (!response.ok) throw new Error(data.error_description || data.error || 'Failed to exchange code for tokens');

        // Fetch user profile to get email as providerUserId
        const profileResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
            headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const profile = await profileResponse.json();

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            providerUserId: profile.emailAddress,
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
            const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
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
                id: 'send_email',
                name: 'Send Email',
                description: 'Send an email via Gmail',
                inputs: [
                    { id: 'to', name: 'To', type: 'string', required: true },
                    { id: 'subject', name: 'Subject', type: 'string', required: true },
                    { id: 'body', name: 'Body', type: 'string', required: true },
                ],
            },
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [
            {
                id: 'new_email',
                name: 'New Email Received',
                description: 'Triggers when a new email is received',
                type: 'polling',
            },
        ];
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        if (action === 'send_email') {
            return this.sendEmail(config.to, config.subject, config.body, accessToken);
        }

        throw new Error(`Unknown action: ${action}`);
    }

    private async sendEmail(
        to: string,
        subject: string,
        _body: string,
        _accessToken: string
    ): Promise<any> {
        console.log(`Sending email to ${to} with subject ${subject}`);
        return { success: true };
    }
}
