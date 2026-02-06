// Integration router - Handles third-party service connections

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { getAllProviders, getProvider } from '@/lib/integrations/registry';
import { TRPCError } from '@trpc/server';

export const integrationRouter = createTRPCRouter({
    // List all integrations for current user
    list: protectedProcedure.query(async ({ ctx }) => {
        const { data, error } = await ctx.supabase
            .from('connections')
            .select('*')
            .eq('user_id', ctx.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message,
            });
        }

        return data || [];
    }),

    // Get available integration providers
    getProviders: protectedProcedure.query(async () => {
        const providers = getAllProviders().map(({ id, provider }) => ({
            slug: id,
            name: provider.name,
            type: provider.type,
            description: `Connect to ${provider.name} to extend your workflows.`,
            auth_type: (provider as any).getAuthUrl ? 'oauth2' : 'api_key', // Heuristic
            is_configured: provider.isConfigured(),
        }));
        return providers;
    }),

    // Get OAuth URL for provider
    getOAuthUrl: protectedProcedure
        .input(
            z.object({
                provider: z.string(),
                redirectUrl: z.string().optional(),
                clientId: z.string().optional(),
                clientSecret: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const provider = getProvider(input.provider);
            if (!provider) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Provider not found' });
            }

            if (!provider.isConfigured() && !input.clientId) {
                return {
                    url: null,
                    unconfigured: true,
                    message: `This provider (${provider.name}) is not configured on the server.`
                };
            }

            const redirectUri = input.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/callback/${input.provider}`;
            const state = Math.random().toString(36).substring(7); // Simple state for CSRF

            // Store custom credentials in session or pass them back somehow?
            // OAuth flow will redirect back, we need these credentials on the callback too.
            // For now, let's assume we use standard ones if available, or error.

            const url = provider.getAuthUrl(redirectUri, state, { clientId: input.clientId });
            return { url, state };
        }),

    // Connect integration (after OAuth callback)
    connect: protectedProcedure
        .input(
            z.object({
                provider: z.string(),
                code: z.string(),
                redirectUri: z.string().optional(),
                displayName: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const provider = getProvider(input.provider);
            if (!provider) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Provider not found' });
            }

            const redirectUri = input.redirectUri || `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/callback/${input.provider}`;

            try {
                const tokens = await provider.exchangeCodeForTokens(input.code, redirectUri);

                const { data, error } = await ctx.supabase
                    .from('connections')
                    .upsert({
                        user_id: ctx.user.id,
                        provider_slug: input.provider,
                        display_name: input.displayName || `${provider.name} Connection`,
                        access_token: tokens.accessToken,
                        refresh_token: tokens.refreshToken,
                        expires_at: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
                        scopes: tokens.scope ? tokens.scope.split(' ') : [],
                        account_id: tokens.providerUserId,
                        status: 'connected',
                        updated_at: new Date().toISOString(),
                    }, {
                        onConflict: 'user_id,provider_slug,account_id'
                    })
                    .select()
                    .single();

                if (error) {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
                }

                return data;
            } catch (err: any) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: err.message || 'Failed to connect integration'
                });
            }
        }),

    // Connect via API Key
    connectApiKey: protectedProcedure
        .input(
            z.object({
                provider: z.string(),
                apiKey: z.string(),
                displayName: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const provider = getProvider(input.provider);
            if (!provider) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Provider not found' });
            }

            // Test if the API key is valid
            const isValid = await provider.testConnection(input.apiKey);
            if (!isValid) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid API Key or Secret' });
            }

            const { data, error } = await ctx.supabase
                .from('connections')
                .upsert({
                    user_id: ctx.user.id,
                    provider_slug: input.provider,
                    display_name: input.displayName || `${provider.name} Connection`,
                    access_token: input.apiKey, // Store API key in access_token field
                    status: 'connected',
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id,provider_slug,account_id'
                })
                .select()
                .single();

            if (error) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return data;
        }),

    // Disconnect integration
    disconnect: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase
                .from('connections')
                .delete()
                .eq('id', input.id)
                .eq('user_id', ctx.user.id);

            if (error) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return { success: true };
        }),

    // Test integration connection
    testConnection: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { data: connection, error } = await ctx.supabase
                .from('connections')
                .select('*')
                .eq('id', input.id)
                .eq('user_id', ctx.user.id)
                .single();

            if (error || !connection) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Connection not found' });
            }

            const provider = getProvider(connection.provider_slug);
            if (!provider) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Provider not found' });
            }

            const isValid = await provider.testConnection(connection.access_token);

            if (!isValid && connection.refresh_token) {
                // Try to refresh
                try {
                    const newTokens = await provider.refreshAccessToken(connection.refresh_token, {
                        clientId: connection.client_id,
                        clientSecret: connection.client_secret
                    });
                    await ctx.supabase
                        .from('connections')
                        .update({
                            access_token: newTokens.accessToken,
                            refresh_token: newTokens.refreshToken || connection.refresh_token,
                            expires_at: newTokens.expiresIn ? new Date(Date.now() + newTokens.expiresIn * 1000).toISOString() : null,
                            status: 'connected'
                        })
                        .eq('id', connection.id);
                    return { success: true, refreshed: true };
                } catch (e) {
                    await ctx.supabase.from('connections').update({ status: 'error' }).eq('id', connection.id);
                    return { success: false, refreshed: false };
                }
            }

            return { success: isValid };
        }),

    // Refresh integration tokens
    refreshTokens: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { data: connection } = await ctx.supabase
                .from('connections')
                .select('*')
                .eq('id', input.id)
                .eq('user_id', ctx.user.id)
                .single();

            if (!connection || !connection.refresh_token) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'No refresh token available' });
            }

            const provider = getProvider(connection.provider_slug);
            if (!provider) throw new TRPCError({ code: 'NOT_FOUND' });

            const tokens = await provider.refreshAccessToken(connection.refresh_token);
            await ctx.supabase
                .from('connections')
                .update({
                    access_token: tokens.accessToken,
                    refresh_token: tokens.refreshToken || connection.refresh_token,
                    expires_at: tokens.expiresIn ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
                })
                .eq('id', input.id);

            return { success: true };
        }),

    // Get integration capabilities
    getCapabilities: protectedProcedure
        .input(z.object({ provider: z.string() }))
        .query(async ({ input }) => {
            const provider = getProvider(input.provider);
            if (!provider) return { actions: [], triggers: [] };

            return {
                actions: provider.getAvailableActions(),
                triggers: provider.getAvailableTriggers(),
            };
        }),
});
