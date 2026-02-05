// Temporal client for starting workflows
// Used by API routes to trigger workflow executions

import { Client } from '@temporalio/client';

let client: Client | null = null;

/**
 * Get Temporal client singleton
 */
export async function getTemporalClient(): Promise<Client> {
    if (!client) {
        client = new Client({
            namespace: process.env.TEMPORAL_NAMESPACE || 'default',
        });
    }
    return client;
}

/**
 * Start workflow execution
 */
export async function startWorkflow(
    workflowId: string,
    userId: string,
    triggerData?: any
) {
    const client = await getTemporalClient();

    const handle = await client.workflow.start('executeWorkflow', {
        taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'workflowos-tasks',
        workflowId: `workflow-${workflowId}-${Date.now()}`,
        args: [{ workflowId, userId, triggerData }],
    });

    return handle.workflowId;
}

/**
 * Get workflow execution status
 */
export async function getWorkflowStatus(workflowExecutionId: string) {
    const client = await getTemporalClient();

    try {
        const handle = client.workflow.getHandle(workflowExecutionId);
        const description = await handle.describe();

        return {
            status: description.status.name,
            startTime: description.startTime,
            closeTime: description.closeTime,
        };
    } catch (error) {
        console.error('Get workflow status error:', error);
        return null;
    }
}

/**
 * Cancel workflow execution
 */
export async function cancelWorkflow(workflowExecutionId: string) {
    const client = await getTemporalClient();

    try {
        const handle = client.workflow.getHandle(workflowExecutionId);
        await handle.cancel();
        return true;
    } catch (error) {
        console.error('Cancel workflow error:', error);
        return false;
    }
}
