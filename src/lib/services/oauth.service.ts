import { prisma } from '@/lib/db';
import { logger } from '@/utils/logger';
import axios from 'axios';

/**
 * Service for handling OAuth flows and token management.
 */
export const oauthService = {
    /**
     * Get access token for a provider, refreshing if necessary
     */
    async getAccessToken(orgId: string, providerId: string): Promise<string> {
        const credential = await prisma.orgCredential.findUnique({
            where: {
                orgId_providerId: { orgId, providerId }
            }
        });

        if (!credential) {
            throw new Error(`No credentials found for ${providerId}`);
        }

        const data = credential.data as any;
        const now = Date.now();
        const buffer = 5 * 60 * 1000; // 5 minute buffer

        if (data.expires_at && now + buffer > data.expires_at) {
            return this.refreshAccessToken(orgId, providerId, data.refresh_token);
        }

        return data.access_token;
    },

    /**
     * Refresh an OAuth access token
     */
    async refreshAccessToken(orgId: string, providerId: string, refreshToken: string): Promise<string> {
        logger.info(`Refreshing token for ${providerId} in org ${orgId}`);

        try {
            // This URL and data would vary by provider in a real implementation
            // Here we use a generic OAuth2 refresh flow mockup
            const response = await axios.post(`https://oauth.${providerId}.com/token`, {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: process.env[`${providerId.toUpperCase()}_CLIENT_ID`],
                client_secret: process.env[`${providerId.toUpperCase()}_CLIENT_SECRET`],
            });

            const { access_token, expires_in } = response.data;
            const expires_at = Date.now() + (expires_in * 1000);

            await prisma.orgCredential.update({
                where: {
                    orgId_providerId: { orgId, providerId }
                },
                data: {
                    data: {
                        ...response.data,
                        expires_at
                    }
                }
            });

            return access_token;
        } catch (error: any) {
            logger.error(`Failed to refresh token for ${providerId}:`, error.response?.data || error.message);
            throw new Error(`Token refresh failed for ${providerId}`);
        }
    }
};
