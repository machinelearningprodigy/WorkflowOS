
// Temporal activities
// Defines the actual work that workflows perform

import { sendEmail } from '@/lib/services/email.service';
import { getProvider } from '@/lib/integrations/registry';
import { logger } from '@/utils/logger';

/**
 * Execute a single workflow step
 */
export async function executeWorkflowStep(
    stepId: string,
    stepConfig: any,
    context: any
): Promise<any> {
    const { provider: providerName, action: actionName, input } = stepConfig;

    logger.info(`Executing step ${stepId}: ${providerName}.${actionName}`);

    const provider = getProvider(providerName);
    if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
    }

    try {
        // Find the action in the provider
        const actions = provider.getActions();
        const action = actions.find(a => a.id === actionName);

        if (!action) {
            throw new Error(`Action ${actionName} not found for provider ${providerName}`);
        }

        // Execute the action
        const result = await action.execute(input);

        return {
            success: true,
            output: result,
            timestamp: new Date().toISOString()
        };
    } catch (error: any) {
        logger.error(`Step ${stepId} failed: ${error.message}`);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Send notification to user
 */
export async function sendNotification(
    userId: string,
    type: string,
    data: any
): Promise<void> {
    try {
        // Mock notification logic for now, or replace with Supabase Client insert
        // const supabase = createClient();
        // await supabase.from('notifications').insert({...});
        logger.info(`Notification for ${userId}: ${type}`, data);
    } catch (error) {
        logger.error('Notification error:', error);
    }
}

/**
 * Log workflow execution
 */
export async function logExecution(
    workflowId: string,
    runId: string,
    status: 'success' | 'failed' | 'running',
    error: string | null = null
): Promise<void> {
    try {
        // Reimplemented without Prisma
        // In a real worker, we would create a Supabase client here too
        logger.info(`Log Execution ${runId}: ${status}`, error || '');
    } catch (err: any) {
        logger.error('Log execution error:', err);
    }
}

/**
 * Send email activity
 */
export async function sendEmailActivity(
    to: string,
    subject: string,
    body: string
): Promise<boolean> {
    return sendEmail({
        to,
        subject,
        html: body,
    });
}

/**
 * HTTP request activity
 */
export async function makeHttpRequest(
    url: string,
    method: string,
    headers?: Record<string, string>,
    body?: any
): Promise<any> {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error: any) {
        logger.error('HTTP request error:', error);
        throw error;
    }
}

/**
 * Wait/delay activity
 */
export async function waitActivity(durationMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, durationMs));
}
