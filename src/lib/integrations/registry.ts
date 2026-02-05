// Integration provider registry
// Central registry for all integration providers

import { IntegrationProvider } from './base.provider';
import { GmailProvider } from './providers/gmail.provider';

const providers = new Map<string, IntegrationProvider>();

// Register all providers
providers.set('gmail', new GmailProvider());
// TODO: Add more providers:
// providers.set('google-sheets', new GoogleSheetsProvider());
// providers.set('stripe', new StripeProvider());
// providers.set('google-calendar', new GoogleCalendarProvider());
// etc.

/**
 * Get integration provider by name
 */
export function getProvider(name: string): IntegrationProvider | undefined {
    return providers.get(name.toLowerCase());
}

/**
 * Get all available providers
 */
export function getAllProviders(): IntegrationProvider[] {
    return Array.from(providers.values());
}

/**
 * Check if provider exists
 */
export function hasProvider(name: string): boolean {
    return providers.has(name.toLowerCase());
}
