import { logger } from "@/utils/logger";
import * as Sentry from "@sentry/nextjs";

/**
 * Service for application monitoring, error reporting, and performance tracking.
 */
export const monitoringService = {
    /**
     * Capture an exception to Sentry
     */
    captureException(error: Error, context: any = {}) {
        logger.error(`Capturing exception: ${error.message}`, context);
        Sentry.captureException(error, { extra: context });
    },

    /**
     * Set user identity for monitoring
     */
    setUser(id: string, email: string) {
        Sentry.setUser({ id, email });
    },

    /**
     * Track a specific performance metric
     */
    measurePerformance(name: string, duration: number) {
        logger.debug(`Performance metric [${name}]: ${duration}ms`);
        // Optional: Send to custom metrics backend
    }
};
