import { createClient } from '@/lib/supabase/server'
import { StepRunner } from './step-runner';
import { ConditionEvaluator } from './condition-evaluator';

interface ExecutionLog {
    stepId: string;
    level?: 'info' | 'error' | 'warn';
    message: string;
    timestamp: Date;
    details?: any;
}

export class WorkflowEngine {
    private supabase;

    constructor() {
        this.supabase = createClient();
    }

    async runWorkflow(workflowId: string, triggerPayload: any = {}) {
        console.log(`[Engine] Starting workflow ${workflowId}`);

        // 1. Fetch Workflow
        const { data: workflow, error: wfError } = await this.supabase
            .from('workflows')
            .select('*')
            .eq('id', workflowId)
            .single();

        if (wfError || !workflow) {
            throw new Error(`Workflow not found: ${wfError?.message}`);
        }

        // 2. Create Run Record
        const { data: run, error: runError } = await this.supabase
            .from('workflow_runs')
            .insert({
                workflow_id: workflowId,
                status: 'running',
                trigger_type: 'manual',
                trigger_payload: triggerPayload,
                started_at: new Date().toISOString()
            })
            .select()
            .single();

        if (runError) {
            throw new Error(`Failed to create run: ${runError.message}`);
        }

        const executionLogs: ExecutionLog[] = [];
        const stepOutputs: Record<string, any> = {
            trigger: triggerPayload // Initial trigger data available as {{steps.trigger}}
        };
        let isSuccess = true;

        try {
            const nodes = workflow.graph_data?.nodes || [];
            const edges = workflow.graph_data?.edges || [];

            // Find Start Node
            // We assume one node with type 'trigger' or 'webhook' etc.
            // Or fallback to finding a node with no incoming edges
            let currentNode = nodes.find((n: any) => n.id === 'trigger' || n.type === 'trigger' || n.type === 'webhook' || n.type === 'manual-trigger');

            if (!currentNode) {
                const targetIds = new Set(edges.map((e: any) => e.target));
                currentNode = nodes.find((n: any) => !targetIds.has(n.id));
            }

            if (!currentNode) {
                throw new Error("No start node found in workflow.");
            }

            // Execution Loop
            while (currentNode) {
                const stepId = currentNode.id;
                const nodeType = currentNode.type;
                const nodeData = currentNode.data || {};
                const nodeLabel = nodeData.label || nodeType;

                console.log(`[Engine] Executing Node: ${nodeLabel} (${stepId})`);
                executionLogs.push({ stepId, message: `Starting step: ${nodeLabel}`, timestamp: new Date() });

                // Execute Step
                const result = await StepRunner.execute(
                    nodeType,
                    nodeData.action,
                    nodeData, // Passing full data as input config
                    {
                        stepId,
                        workflowId,
                        executionId: run.id,
                        input: nodeData,
                        environment: {}, // TODO: Load env vars from secure storage
                        previousSteps: stepOutputs
                    }
                );

                // Log Result
                if (result.logs) {
                    result.logs.forEach(log => executionLogs.push({ stepId, message: log, timestamp: new Date() }));
                }

                if (!result.success) {
                    isSuccess = false;
                    executionLogs.push({ stepId, level: 'error', message: result.error || 'Step failed', timestamp: new Date() });
                    break; // Stop execution on failure
                }

                // Store Output
                // We store output by stepId to be referenced as {{steps.stepId.data.foo}}
                stepOutputs[stepId] = result.output;

                executionLogs.push({ stepId, message: `Completed step successfully`, timestamp: new Date() });

                // Determine Next Node / Branching
                if (nodeType === 'condition') {
                    // Condition nodes use special logic
                    const conditionResult = ConditionEvaluator.evaluateGroup(nodeData.conditions || [], nodeData.logic || 'AND', stepOutputs);

                    executionLogs.push({ stepId, message: `Condition evaluated to: ${conditionResult}`, timestamp: new Date() });

                    // Find the edge that matches the result (handled as 'true' or 'false')
                    const targetHandle = conditionResult ? 'true' : 'false';

                    // React Flow edges often have sourceHandle set for multiple outputs
                    const edge = edges.find((e: any) => e.source === stepId && e.sourceHandle === targetHandle);

                    // If no specific handle edge found, maybe check for default connection (less likely for condition node)
                    currentNode = edge ? nodes.find((n: any) => n.id === edge.target) : null;

                } else {
                    // Linear flow - follow the outgoing edge from this node
                    const edge = edges.find((e: any) => e.source === stepId);
                    currentNode = edge ? nodes.find((n: any) => n.id === edge.target) : null;
                }
            }

            // 4. Update Run Status
            await this.supabase
                .from('workflow_runs')
                .update({
                    status: isSuccess ? 'completed' : 'failed',
                    completed_at: new Date().toISOString(),
                    logs: executionLogs,
                    outputs: stepOutputs
                })
                .eq('id', run.id);

            return { runId: run.id, status: isSuccess ? 'completed' : 'failed' };

        } catch (error: any) {
            console.error('[Engine Execution Error]', error);

            await this.supabase
                .from('workflow_runs')
                .update({
                    status: 'failed',
                    completed_at: new Date().toISOString(),
                    logs: [...executionLogs, { stepId: 'engine', level: 'error', message: error.message, timestamp: new Date() }],
                    error_message: error.message
                })
                .eq('id', run.id);

            throw error;
        }
    }
}
