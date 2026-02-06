import { createClient } from '@/lib/supabase/server';
import { WorkflowEngine } from '@/lib/workflow-engine/core';

export class WorkflowExecutionService {
    private engine: WorkflowEngine;

    constructor() {
        this.engine = new WorkflowEngine();
    }

    async runWorkflow(workflowId: string, triggerPayload: any = {}) {
        return await this.engine.runWorkflow(workflowId, triggerPayload);
    }

    async getHistory(workflowId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workflow_runs')
            .select('*')
            .eq('workflow_id', workflowId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async getRunDetails(runId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workflow_runs')
            .select('*')
            .eq('id', runId)
            .single();

        if (error) throw error;
        return data;
    }
}

export const workflowService = new WorkflowExecutionService();
