import { BaseProvider, TokenResponse, Action, Trigger } from '../base.provider';

export class SlackProvider extends BaseProvider {
    name = 'Slack';
    type = 'COMMUNICATION';

    private clientId = process.env.SLACK_CLIENT_ID!;
    private clientSecret = process.env.SLACK_CLIENT_SECRET!;
    private scopes = ['chat:write', 'channels:read', 'users:read'];

    override isConfigured(): boolean {
        return !!this.clientId && !!this.clientSecret;
    }

    getAuthUrl(redirectUri: string, state: string, overrides?: { clientId?: string }): string {
        const clientId = overrides?.clientId || this.clientId;
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: this.scopes.join(' '),
            state,
        });
        return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string, overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        const clientId = overrides?.clientId || this.clientId;
        const clientSecret = overrides?.clientSecret || this.clientSecret;
        const params = new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
        });

        const response = await fetch('https://slack.com/api/oauth.v2.access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        const data = await response.json();

        if (!data.ok) {
            throw new Error(`Slack OAuth Error: ${data.error}`);
        }

        return {
            accessToken: data.access_token,
            providerUserId: data.authed_user?.id || data.team?.id,
        };
    }

    async refreshAccessToken(_refreshToken: string, _overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        // Slack rotation logic if enabled
        return { accessToken: '' }; // Not implemented for simple bot tokens
    }

    async testConnection(accessToken: string): Promise<boolean> {
        const response = await fetch('https://slack.com/api/auth.test', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        return data.ok;
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: 'send_message',
                name: 'Send Message',
                description: 'Send a message to a channel',
                inputs: [
                    { id: 'channel', name: 'Channel ID', type: 'string', required: true },
                    { id: 'text', name: 'Message Text', type: 'string', required: true }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [];
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        if (action === 'send_message') {
            const response = await fetch('https://slack.com/api/chat.postMessage', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    channel: config.channel,
                    text: config.text
                })
            });
            return await response.json();
        }
        throw new Error(`Unknown action: ${action}`);
    }
}
