import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { WorkflowEngine } from '@/lib/workflow-engine/core';

export const workflowRouter = createTRPCRouter({
    // List all workflows for current user
    list: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(50),
                cursor: z.number().optional(),
                filter: z.enum(['all', 'active', 'paused', 'draft']).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            let query = ctx.supabase
                .from('workflows')
                .select('*', { count: 'exact' })
                .eq('user_id', ctx.user.id);

            if (input.filter && input.filter !== 'all') {
                query = query.eq('status', input.filter);
            }

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(input.cursor || 0, (input.cursor || 0) + input.limit - 1);

            if (error) {
                // If status column doesn't exist yet, fallback to active/inactive boolean logic or just fail gracefully
                console.error("Error fetching workflows:", error);
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return {
                items: data,
                totalCount: count || 0,
            };
        }),

    // Get a specific workflow by ID
    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            // 1. Fetch workflow
            const { data: workflow, error } = await ctx.supabase
                .from('workflows')
                .select('*')
                .eq('id', input.id)
                .eq('user_id', ctx.user.id)
                .single();

            if (error) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Workflow not found' });
            }

            // 2. Fetch all active connections for this user
            const { data: connections } = await ctx.supabase
                .from('connections')
                .select('provider_slug, status')
                .eq('user_id', ctx.user.id)
                .eq('status', 'connected');

            const connectedProviders = new Set(connections?.map((c: { provider_slug: string }) => c.provider_slug) || []);

            // 3. Update node connection statuses dynamically
            if (workflow.definition && typeof workflow.definition === 'object') {
                const def = workflow.definition as any;
                if (Array.isArray(def.nodes)) {
                    def.nodes = def.nodes.map((node: any) => {
                        if (node.data && node.data.provider) {
                            // Utility nodes are always connected
                            const isUtility = ['trigger', 'wait', 'manual-trigger'].includes(node.data.provider.toLowerCase());
                            if (isUtility) {
                                node.data.isConnected = true;
                            } else {
                                // Check against real connections
                                node.data.isConnected = connectedProviders.has(node.data.provider);
                            }
                        }
                        return node;
                    });
                }
            }

            return workflow;
        }),

    // Create a new workflow
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                description: z.string().optional(),
                definition: z.any().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('workflows')
                .insert({
                    name: input.name,
                    description: input.description,
                    definition: input.definition || { nodes: [], edges: [] },
                    user_id: ctx.user.id,
                    status: 'draft', // Ensure column exists in DB using update_schema.sql
                })
                .select()
                .single();

            if (error) {
                console.error("Error creating workflow:", error);
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return data;
        }),

    // Update workflow
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
                definition: z.any().optional(),
                status: z.enum(['active', 'paused', 'draft']).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updateData: any = {
                updated_at: new Date().toISOString(),
            };
            if (input.name) updateData.name = input.name;
            if (input.description) updateData.description = input.description;
            if (input.definition) updateData.definition = input.definition;
            if (input.status) updateData.status = input.status;

            const { data, error } = await ctx.supabase
                .from('workflows')
                .update(updateData)
                .eq('id', input.id)
                .eq('user_id', ctx.user.id)
                .select()
                .single();

            if (error) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return data;
        }),

    // Delete workflow
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase
                .from('workflows')
                .delete()
                .eq('id', input.id)
                .eq('user_id', ctx.user.id);

            if (error) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return { success: true };
        }),

    // Toggle workflow active status (Legacy support, maps to status)
    toggleActive: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { data: current } = await ctx.supabase
                .from('workflows')
                .select('status, is_active')
                .eq('id', input.id)
                .single();

            // Toggle logic: If active -> paused, if anything else -> active
            const newStatus = current?.status === 'active' ? 'paused' : 'active';
            const isActive = newStatus === 'active';

            const { data, error } = await ctx.supabase
                .from('workflows')
                .update({
                    status: newStatus,
                    is_active: isActive
                })
                .eq('id', input.id)
                .eq('user_id', ctx.user.id)
                .select()
                .single();

            if (error) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return data;
        }),

    // Execute workflow manually
    execute: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                triggerData: z.record(z.any()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const engine = new WorkflowEngine();
            // Start execution
            const result = await engine.runWorkflow(input.id, input.triggerData);

            return { id: result.runId, status: result.status };
        }),

    // Test a single step (Preview execution)
    testStep: protectedProcedure
        .input(
            z.object({
                workflowId: z.string(),
                nodeId: z.string(),
                type: z.string(), // provider slug
                action: z.string().optional(),
                config: z.any(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Import dynamically to avoid circular deps if any, or just use imported StepRunner
            const { StepRunner } = await import('@/lib/workflow-engine/step-runner');

            // DEBUG: Check if we are receiving the correct config
            if (input.type === 'google-sheets') {
                const missing = [];
                if (!input.config.range) missing.push('range');
                if (!input.config.spreadsheetId) missing.push('spreadsheetId');
                if (!input.config.values) missing.push('values');

                if (missing.length > 0) {
                    throw new Error(`Debug: Missing keys in config: ${missing.join(', ')}. Received keys: ${Object.keys(input.config).join(', ')}`);
                }
            }

            // Construct context for the single step test
            // We won't have previous steps data in a raw test usually,
            // unless we pass it from client? For now, assume empty context or basic environment.
            const stepResult = await StepRunner.execute(
                input.type,
                input.action || 'default',
                input.config,
                {
                    stepId: input.nodeId,
                    workflowId: input.workflowId,
                    executionId: 'test-execution',
                    userId: ctx.user.id,
                    input: input.config,
                    environment: {},
                    previousSteps: {} // No previous context in isolation test
                }
            );

            return stepResult;
        }),

    // Get latest execution
    getLatestRun: protectedProcedure
        .input(z.object({ workflowId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('workflow_runs')
                .select('*')
                .eq('workflow_id', input.workflowId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) return null;
            return data;
        }),

    // AI generation
    generateFromPrompt: protectedProcedure
        .input(
            z.object({
                prompt: z.string().min(1),
                workflowId: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            const prompt = input.prompt.toLowerCase();
            const nodes: any[] = [];
            const edges: any[] = [];
            let yPos = 100;

            nodes.push({
                id: 'trigger-1',
                type: 'workflow',
                position: { x: 250, y: yPos },
                data: {
                    label: 'Manual Trigger',
                    provider: 'trigger',
                    description: 'Start this workflow manually',
                    isConnected: true
                },
            });

            const integrations = [
                { keywords: ['email', 'gmail', 'send mail'], provider: 'gmail', label: 'Send Email' },
                { keywords: ['slack', 'message', 'notify'], provider: 'slack', label: 'Slack Message' },
                { keywords: ['calendar', 'meeting', 'schedule'], provider: 'google-calendar', label: 'Add Event' },
                { keywords: ['youtube', 'video', 'channel'], provider: 'youtube', label: 'YouTube Action' },
                { keywords: ['ai', 'gemini', 'generate', 'llm', 'create content'], provider: 'google-gemini', label: 'Generate Content (AI)' },
                { keywords: ['maps', 'direction', 'location', 'place'], provider: 'google-maps', label: 'Get Location' },
                { keywords: ['sheet', 'spreadsheet', 'excel', 'row', 'save to sheet'], provider: 'google-sheets', label: 'Add Row to Sheet' },
                { keywords: ['form', 'response', 'survey'], provider: 'google-forms', label: 'Watch Responses' },
                { keywords: ['linear', 'issue', 'ticket'], provider: 'linear', label: 'Create Issue' },
            ];

            let lastNodeId = 'trigger-1';
            let stepCount = 0;

            // Simple parser: iterate through keywords and add nodes in order of appearance in the prompt?
            // Or just iterate through providers and check if prompt contains them.
            // Be careful not to match substrings incorrectly (e.g. "mail" in "gmail").

            // A better way for V1 is to find all matches, then sort them by their position in the prompt
            const matches: { index: number, integration: typeof integrations[0] }[] = [];

            integrations.forEach(integration => {
                integration.keywords.forEach(keyword => {
                    const idx = prompt.indexOf(keyword);
                    if (idx !== -1) {
                        // Check if we already have this provider added to matches (avoid duplicate nodes for same provider unless typically chained)
                        // For now unique providers only for simplicity
                        if (!matches.some(m => m.integration.provider === integration.provider)) {
                            matches.push({ index: idx, integration });
                        }
                    }
                });
            });

            // Sort by occurrence in text to respect user order (e.g. "Gen AI then Email" vs "Email then Gen AI")
            matches.sort((a, b) => a.index - b.index);

            matches.forEach(match => {
                const integration = match.integration;
                stepCount++;
                const nodeId = `node-${stepCount}`;
                yPos += 150;

                nodes.push({
                    id: nodeId,
                    type: 'workflow',
                    position: { x: 250, y: yPos },
                    data: {
                        label: integration.label,
                        provider: integration.provider, // Must match CLIENT PROVIDER_ICONS keys (e.g. 'google-gemini')
                        description: `AI-suggested step for ${integration.label}`,
                        isConnected: false // Pending user config
                    },
                });

                edges.push({
                    id: `edge-${lastNodeId}-${nodeId}`,
                    source: lastNodeId,
                    target: nodeId,
                    animated: true,
                    style: { stroke: '#6366f1', strokeWidth: 2 }
                });

                lastNodeId = nodeId;
            });

            return { nodes, edges };
        }),
});
