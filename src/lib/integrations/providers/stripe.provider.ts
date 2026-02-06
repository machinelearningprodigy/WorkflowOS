import { BaseProvider, Action, Trigger, TokenResponse } from '../base.provider';

export class StripeProvider extends BaseProvider {
    name = 'Stripe';
    type = 'stripe';
    override authType: 'oauth2' | 'api_key' | 'basic' = 'api_key';

    override isConfigured(): boolean {
        return !!process.env.STRIPE_CLIENT_ID && !!process.env.STRIPE_SECRET_KEY;
    }

    getAuthUrl(redirectUri: string, state: string, overrides?: { clientId?: string }): string {
        const clientId = overrides?.clientId || process.env.STRIPE_CLIENT_ID;
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId || '',
            scope: 'read_write',
            redirect_uri: redirectUri,
            state,
        });
        return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
    }

    async exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse> {
        const response = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                grant_type: 'authorization_code',
                client_secret: process.env.STRIPE_SECRET_KEY,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to Connect Stripe account');
        }

        const data = await response.json();
        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            providerUserId: data.stripe_user_id,
            expiresIn: 0,
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
        const response = await fetch('https://connect.stripe.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_secret: process.env.STRIPE_SECRET_KEY,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh Stripe token');
        }

        const data = await response.json();
        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: 0
        };
    }

    async testConnection(accessToken: string): Promise<boolean> {
        try {
            const response = await fetch('https://api.stripe.com/v1/customers?limit=1', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    getAvailableActions(): Action[] {
        return [
            {
                id: 'create_customer',
                name: 'Create Customer',
                description: 'Create a new customer in Stripe',
                inputs: [
                    { id: 'email', name: 'Email', type: 'string', required: true },
                    { id: 'name', name: 'Name', type: 'string', required: false },
                    { id: 'description', name: 'Description', type: 'string', required: false }
                ]
            },
            {
                id: 'create_payment_intent',
                name: 'Create Payment Intent',
                description: 'Create a payment intent for checkout',
                inputs: [
                    { id: 'amount', name: 'Amount (in cents)', type: 'number', required: true },
                    { id: 'currency', name: 'Currency (e.g. usd)', type: 'string', required: true },
                    { id: 'customerId', name: 'Customer ID', type: 'string', required: false }
                ]
            }
        ];
    }

    getAvailableTriggers(): Trigger[] {
        return [];
    }

    async executeAction(action: string, config: any, accessToken: string): Promise<any> {
        const baseUrl = 'https://api.stripe.com/v1';

        switch (action) {
            case 'create_customer': {
                const body = new URLSearchParams();
                if (config.email) body.append('email', config.email);
                if (config.name) body.append('name', config.name);
                if (config.description) body.append('description', config.description);

                return this.makeRequest(`${baseUrl}/customers`, 'POST', body, accessToken);
            }
            case 'create_payment_intent': {
                const body = new URLSearchParams();
                body.append('amount', config.amount.toString());
                body.append('currency', config.currency);
                if (config.customerId) body.append('customer', config.customerId);

                return this.makeRequest(`${baseUrl}/payment_intents`, 'POST', body, accessToken);
            }
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }

    private async makeRequest(url: string, method: string, body: URLSearchParams, accessToken: string) {
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Or process.env.STRIPE_SECRET_KEY if system-wide
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error?.message || errorText);
            } catch (e) {
                throw new Error(`Stripe API Error: ${errorText}`);
            }
        }

        return await response.json();
    }
}
