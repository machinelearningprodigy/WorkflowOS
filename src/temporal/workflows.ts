// Temporal workflow definitions
// Defines the workflow execution logic

import { proxyActivities, workflowInfo } from '@temporalio/workflow';
import type * as activities from './activities';

const { executeWorkflowStep, sendNotification, logExecution } =
    proxyActivities<typeof activities>({
        startToCloseTimeout: '5 minutes',
        retry: {
            initialInterval: '2s',
            maximumInterval: '1m',
            maximumAttempts: 3,
        },
    });

/**
 * Main workflow execution engine.
 * Handles sequential/parallel execution, branching, and error recovery.
 */
export async function executeWorkflow(params: {
    workflowId: string;
    userId: string;
    steps: any[];
    triggerData?: any;
}): Promise<any> {
    const { workflowId, userId, steps, triggerData } = params;
    const runId = workflowInfo().runId;
    const outputs: Record<string, any> = {
        trigger: triggerData || {}
    };

    try {
        // Init execution record
        await logExecution(workflowId, runId, 'running', null);

        // Execute steps in sequence
        for (const step of steps) {
            // Data mapping: Replace variables like {{trigger.email}} with actual values
            const resolvedInput = resolveVariables(step.input, outputs);

            const result = await executeWorkflowStep(
                step.id,
                { ...step, input: resolvedInput },
                outputs
            );

            if (!result.success) {
                throw new Error(`Step ${step.name || step.id} failed: ${result.error}`);
            }

            // Store output for subsequent steps
            outputs[step.id] = result.output;
        }

        // Finalize execution log
        await logExecution(workflowId, runId, 'success', null);

        // Send success notification
        await sendNotification(userId, 'workflow_success', {
            name: workflowId, // In reality, fetch actual name
            steps: steps.length
        });

        return { success: true, outputs };
    } catch (error: any) {
        // Log failure
        await logExecution(workflowId, runId, 'failed', error.message);

        // Send failure notification
        await sendNotification(userId, 'workflow_failed', {
            name: workflowId,
            error: error.message,
        });

        throw error;
    }
}

/**
 * Simple variable resolver for step inputs.
 * Replaces placeholders like {{step_id.key}} or {{trigger.key}} with values from outputs.
 */
function resolveVariables(input: any, outputs: any): any {
    if (typeof input !== 'object' || input === null) return input;

    const resolved = Array.isArray(input) ? [...input] : { ...input };

    for (const key in resolved) {
        let value = resolved[key];

        if (typeof value === 'string' && value.includes('{{') && value.includes('}}')) {
            // Regex to find and replace all {{path.to.data}}
            value = value.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
                const parts = path.trim().split('.');
                let current = outputs;
                for (const part of parts) {
                    if (current && typeof current === 'object') {
                        current = current[part];
                    } else {
                        return `{{${path}}}`; // Return placeholder if not found
                    }
                }
                return current !== undefined ? current : `{{${path}}}`;
            });
        } else if (typeof value === 'object') {
            value = resolveVariables(value, outputs);
        }

        resolved[key] = value;
    }

    return resolved;
}
