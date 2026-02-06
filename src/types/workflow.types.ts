/**
 * Workflow related types and interfaces.
 */

export type WorkflowStatus = 'active' | 'draft' | 'paused' | 'archived';

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    status: WorkflowStatus;
    orgId: string;
    createdAt: string;
    updatedAt: string;
    lastExecuted?: string;
}

export interface WorkflowStep {
    id: string;
    workflowId: string;
    type: 'trigger' | 'action' | 'condition';
    provider: string; // e.g., 'gmail', 'slack'
    operation: string; // e.g., 'send_email', 'new_message'
    config: Record<string, any>;
    position: { x: number; y: number };
    nextStepIds: string[];
}

export interface WorkflowExecution {
    id: string;
    workflowId: string;
    status: 'success' | 'failed' | 'running';
    startTime: string;
    endTime?: string;
    duration?: number;
    error?: string;
    triggerPayload: Record<string, any>;
}
