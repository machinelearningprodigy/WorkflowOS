import { prisma } from '@/lib/db';
import { startWorkflow } from '@/temporal/client';
import { logger } from '@/utils/logger';

/**
 * Service for handling incoming webhooks and triggering workflows.
 */
export const webhookService = {
    /**
     * Process an incoming webhook
     */
    async handleWebhook(slug: string, payload: any, headers: Record<string, string>) {
        logger.info(`Incoming webhook for slug: ${slug}`);

        try {
            // Find the workflow associated with this webhook slug
            const workflow = await prisma.workflow.findFirst({
                where: {
                    webhookSlug: slug,
                    status: 'active'
                },
                include: {
                    steps: {
                        orderBy: { order: 'asc' }
                    }
                }
            });

            if (!workflow) {
                logger.warn(`No active workflow found for webhook slug: ${slug}`);
                return { success: false, error: 'Workflow not found or inactive' };
            }

            // Trigger the Temporal workflow
            const runId = await startWorkflow({
                workflowId: workflow.id,
                userId: workflow.creatorId,
                steps: workflow.steps as any,
                triggerData: {
                    payload,
                    headers,
                    timestamp: new Date().toISOString()
                }
            });

            return { success: true, runId };
        } catch (error: any) {
            logger.error(`Webhook processing failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
};
