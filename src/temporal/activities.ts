// Temporal activities
// Defines the actual work that workflows perform

import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/services/email.service';

/**
 * Execute a single workflow step
 */
export async function executeWorkflowStep(
    stepId: string,
    stepConfig: any,
    context: any
): Promise<any> {
    // TODO: Implement step execution based on action type
    // - send_email
    // - update_spreadsheet
    // - create_calendar_event
    // - send_sms
    // - http_request
    // - etc.

    return { success: true };
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
        await prisma.notification.create({
            data: {
                userId,
                type: type as any,
                title: getNotificationTitle(type),
                message: getNotificationMessage(type, data),
                metadata: data,
            },
        });
    } catch (error) {
        console.error('Notification error:', error);
    }
}

/**
 * Log workflow execution
 */
export async function logExecution(
    workflowId: string,
    status: string,
    error: string | null
): Promise<void> {
    try {
        // TODO: Update workflow run record in database
        console.log(`Workflow ${workflowId}: ${status}`, error);
    } catch (error) {
        console.error('Log execution error:', error);
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
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        return await response.json();
    } catch (error) {
        console.error('HTTP request error:', error);
        throw error;
    }
}

/**
 * Wait/delay activity
 */
export async function waitActivity(durationMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, durationMs));
}

// Helper functions
function getNotificationTitle(type: string): string {
    const titles: Record<string, string> = {
        workflow_success: 'Workflow Completed',
        workflow_failed: 'Workflow Failed',
        integration_disconnected: 'Integration Disconnected',
        limit_reached: 'Usage Limit Reached',
    };
    return titles[type] || 'Notification';
}

function getNotificationMessage(type: string, data: any): string {
    // TODO: Generate appropriate message based on type and data
    return JSON.stringify(data);
}
