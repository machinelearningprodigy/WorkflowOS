// Base integration provider interface
// All integration providers must implement this interface

export interface IntegrationProvider {
    name: string;
    type: string;

    // OAuth configuration
    getAuthUrl(redirectUri: string, state: string): string;
    exchangeCodeForTokens(code: string, redirectUri: string): Promise<TokenResponse>;
    refreshAccessToken(refreshToken: string): Promise<TokenResponse>;

    // Connection testing
    testConnection(accessToken: string): Promise<boolean>;

    // Available actions
    getAvailableActions(): Action[];

    // Available triggers
    getAvailableTriggers(): Trigger[];

    // Execute action
    executeAction(action: string, config: any, accessToken: string): Promise<any>;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    scope?: string;
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
