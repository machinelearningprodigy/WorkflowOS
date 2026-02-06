import { logger } from '@/utils/logger';
import { Twilio } from 'twilio';

/**
 * Service for sending SMS notifications and alerts.
 */
export const smsService = {
    /**
     * Send an SMS message via Twilio
     */
    async sendSMS(to: string, body: string): Promise<boolean> {
        logger.info(`Sending SMS to ${to}`);

        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            logger.warn('Twilio credentials missing. SMS was not sent but logged.');
            logger.debug(`SMS Body: ${body}`);
            return true; // Return true in dev/mock scenarios
        }

        try {
            const client = new Twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );

            await client.messages.create({
                body,
                to,
                from: process.env.TWILIO_PHONE_NUMBER,
            });

            return true;
        } catch (error: any) {
            logger.error(`SMS failed to ${to}:`, error.message);
            return false;
        }
    }
};
