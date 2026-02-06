import { prisma } from '@/lib/db';
import { logger } from '@/utils/logger';

/**
 * Service for tracking and retrieving application analytics.
 */
export const analyticsService = {
    /**
     * Track a custom event
     */
    async trackEvent(orgId: string, event: string, metadata: any = {}) {
        try {
            await prisma.analyticsEvent.create({
                data: {
                    orgId,
                    event,
                    metadata,
                }
            });
        } catch (error) {
            logger.error(`Failed to track event ${event}:`, error);
        }
    },

    /**
     * Get workflow success rate over time
     */
    async getSuccessRate(orgId: string, days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const stats = await prisma.workflowRun.groupBy({
            by: ['status'],
            where: {
                workflow: { orgId },
                startTime: { gte: startDate }
            },
            _count: true
        });

        const success = stats.find(s => s.status === 'success')?._count || 0;
        const failed = stats.find(s => s.status === 'failed')?._count || 0;
        const total = success + failed;

        return {
            rate: total > 0 ? (success / total) * 100 : 100,
            success,
            failed,
            total
        };
    },

    /**
     * Get total time saved for an organization
     */
    async getTimeSaved(orgId: string) {
        // Logic to calculate time saved based on executions and estimated manual time
        const totalExecutions = await prisma.workflowRun.count({
            where: {
                workflow: { orgId },
                status: 'success'
            }
        });

        const AVG_MANUAL_TIME_SECONDS = 300; // 5 minutes saved per automation
        return (totalExecutions * AVG_MANUAL_TIME_SECONDS) / 3600; // Return in hours
    }
};
