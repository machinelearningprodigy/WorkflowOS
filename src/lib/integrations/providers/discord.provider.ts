import { BaseProvider, Action, TokenResponse } from '../base.provider';

export class DiscordProvider extends BaseProvider {
    name = 'Discord';
    type = 'COMMUNICATION';

    private clientId = process.env.DISCORD_CLIENT_ID!;
    private clientSecret = process.env.DISCORD_CLIENT_SECRET!;

    getAuthUrl(redirectUri: string, state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'identify guilds guilds.join messages.read',
            state,
        });
        return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Discord OAuth Error: ${data.error_description || data.error}`);
        }

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            scope: data.scope,
        };
    }

    async testConnection(accessToken: string): Promise<boolean> {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return response.ok;
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: 'send_webhook_message',
                name: 'Send Webhook Message',
                description: 'Send a message to a Discord channel via Webhook',
                inputs: [
                    { id: 'webhookUrl', name: 'Webhook URL', type: 'string', required: true },
                    { id: 'content', name: 'Message Content', type: 'string', required: true },
                    { id: 'username', name: 'Bot Name', type: 'string', required: false },
                ]
            }
        ];
    }

    async executeAction(action: string, config: any, _accessToken: string): Promise<any> {
        if (action === 'send_webhook_message') {
            const response = await fetch(config.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: config.content,
                    username: config.username || 'WorkflowOS Bot',
                })
            });
            return response.ok ? { success: true } : await response.json();
        }
        throw new Error(`Unknown action: ${action}`);
    }
}