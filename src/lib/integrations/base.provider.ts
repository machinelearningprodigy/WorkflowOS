// Base integration provider interface
// All integration providers must implement this interface

export interface IntegrationProvider {
    name: string;
    type: string;
    authType: 'oauth2' | 'api_key' | 'basic';

    // OAuth configuration
    getAuthUrl(redirectUri: string, state: string, overrides?: { clientId?: string }): string;
    exchangeCodeForTokens(code: string, redirectUri: string, overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse>;
    refreshAccessToken(refreshToken: string, overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse>;

    // Connection testing
    testConnection(accessToken: string): Promise<boolean>;

    // Available actions
    getAvailableActions(): Action[];

    // Available triggers
    getAvailableTriggers(): Trigger[];

    // Configuration check
    isConfigured(): boolean;

    // Execute action
    executeAction(action: string, config: any, accessToken: string): Promise<any>;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    scope?: string;
    providerUserId?: string;
}

export interface Action {
    id: string;
    name: string;
    description: string;
    inputs: ActionInput[];
}

export interface ActionInput {
    id: string;
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
    required: boolean;
    options?: Array<{ label: string; value: string }>;
}

export interface Trigger {
    id: string;
    name: string;
    description: string;
    type: 'webhook' | 'polling';
}

export abstract class BaseProvider implements IntegrationProvider {
    abstract name: string;
    abstract type: string;
    authType: 'oauth2' | 'api_key' | 'basic' = 'oauth2';

    getAuthUrl(_redirectUri: string, _state: string, _overrides?: { clientId?: string }): string {
        return '';
    }

    async exchangeCodeForTokens(_code: string, _redirectUri: string, _overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        return { accessToken: '' };
    }

    async refreshAccessToken(_refreshToken: string, _overrides?: { clientId?: string, clientSecret?: string }): Promise<TokenResponse> {
        return { accessToken: '' };
    }

    async testConnection(_accessToken: string): Promise<boolean> {
        return true;
    }

    getAvailableActions(): Action[] {
        return [];
    }

    getAvailableTriggers(): Trigger[] {
        return [];
    }

    isConfigured(): boolean {
        return true;
    }

    async executeAction(_action: string, _config: any, _accessToken: string): Promise<any> {
        return {};
    }
}
