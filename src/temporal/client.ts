// Temporal client for starting workflows
// Used by API routes to trigger workflow executions

import { Client, Connection } from '@temporalio/client';
import { logger } from '@/utils/logger';

let client: Client | null = null;

/**
 * Get Temporal client singleton.
 * Handles lazy connection and error recovery.
 */
export async function getTemporalClient(): Promise<Client> {
    if (client) return client;

    try {
        const address = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
        const connection = await Connection.connect({ address });

        client = new Client({
            connection,
            namespace: process.env.TEMPORAL_NAMESPACE || 'default',
        });

        logger.info(`Temporal client connected to ${address}`);
        return client;
    } catch (error) {
        logger.error('Failed to connect to Temporal:', error);
        throw error;
    }
}

/**
 * Start workflow execution.
 * Returns the business-level workflow execution ID.
 */
export async function startWorkflow(params: {
    workflowId: string;
    userId: string;
    steps: any[];
    triggerData?: any;
}) {
    const client = await getTemporalClient();
    const { workflowId, userId, steps, triggerData } = params;

    try {
        const handle = await client.workflow.start('executeWorkflow', {
            taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'workflowos-tasks',
            workflowId: `run-${workflowId}-${Date.now()}`,
            args: [{ workflowId, userId, steps, triggerData }],
        });

        logger.info(`Started workflow ${workflowId}, Run ID: ${handle.workflowId}`);
        return handle.workflowId;
    } catch (error) {
        logger.error(`Error starting workflow ${workflowId}:`, error);
        throw error;
    }
}

/**
 * Get workflow execution status.
 */
export async function getWorkflowStatus(runId: string) {
    const client = await getTemporalClient();

    try {
        const handle = client.workflow.getHandle(runId);
        const description = await handle.describe();

        return {
            runId: description.runId,
            status: description.status.name,
            startTime: description.startTime,
            closeTime: description.closeTime,
        };
    } catch (error) {
        logger.error(`Error getting status for run ${runId}:`, error);
        return null;
    }
}

/**
 * Cancel a running workflow.
 */
export async function cancelWorkflow(runId: string) {
    const client = await getTemporalClient();

    try {
        const handle = client.workflow.getHandle(runId);
        await handle.cancel();
        logger.info(`Cancelled workflow run ${runId}`);
        return true;
    } catch (error) {
        logger.error(`Error cancelling workflow run ${runId}:`, error);
        return false;
    }
}
