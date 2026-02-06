/**
 * Integration related types and interfaces.
 */

export type IntegrationCategory =
    | 'communication'
    | 'crm'
    | 'marketing'
    | 'payments'
    | 'storage'
    | 'productivity'
    | 'developer';

export interface Integration {
    id: string;
    name: string;
    description: string;
    category: IntegrationCategory;
    iconUrl: string;
    isComingSoon?: boolean;
}

export interface ConnectedIntegration {
    id: string;
    providerId: string; // e.g., 'gmail'
    orgId: string;
    name: string;
    status: 'connected' | 'error' | 'reconnecting';
    createdAt: string;
    expiresAt?: string;
}

export interface AuthCredential {
    id: string;
    provider: string;
    name: string;
    data: Record<string, any>; // Securely stored credentials
}
