// Workflow router - Handles workflow CRUD and execution operations

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

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
                .eq('user_id', ctx.user.id)
                .order('created_at', { ascending: false });

            if (input.filter && input.filter !== 'all') {
                if (input.filter === 'active') query = query.eq('is_active', true);
                if (input.filter === 'paused') query = query.eq('is_active', false);
            }

            const from = input.cursor || 0;
            const to = from + input.limit - 1;

            const { data, error, count } = await query.range(from, to);

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return {
                workflows: data || [],
                nextCursor: (data && data.length === input.limit) ? to + 1 : null,
                total: count
            };
        }),

    // Get single workflow by ID
    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('workflows')
                .select('*')
                .eq('id', input.id)
                .eq('user_id', ctx.user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    throw new TRPCError({ code: 'NOT_FOUND' });
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return data;
        }),

    // Create new workflow
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).max(100),
                description: z.string().optional(),
                definition: z.record(z.any()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const definition = input.definition || {
                nodes: [],
                edges: []
            };

            const { data, error } = await ctx.supabase
                .from('workflows')
                .insert({
                    user_id: ctx.user.id,
                    name: input.name,
                    description: input.description,
                    is_active: false,
                    definition: definition,
                })
                .select()
                .single();

            if (error) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return data;
        }),

    // Update existing workflow
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().optional(),
                description: z.string().optional(),
                isActive: z.boolean().optional(),
                definition: z.record(z.any()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updates: any = {};
            if (input.name !== undefined) updates.name = input.name;
            if (input.description !== undefined) updates.description = input.description;
            if (input.isActive !== undefined) updates.is_active = input.isActive;
            if (input.definition) updates.definition = input.definition;

            const { data, error } = await ctx.supabase
                .from('workflows')
                .update(updates)
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

    // Toggle workflow active status
    toggleActive: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { data: current } = await ctx.supabase
                .from('workflows')
                .select('is_active')
                .eq('id', input.id)
                .single();

            const { data, error } = await ctx.supabase
                .from('workflows')
                .update({ is_active: !current?.is_active })
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
            const { data: workflow, error: workflowError } = await ctx.supabase
                .from('workflows')
                .select('id, definition')
                .eq('id', input.id)
                .eq('user_id', ctx.user.id)
                .single();

            if (workflowError || !workflow) {
                throw new TRPCError({ code: 'NOT_FOUND', message: 'Workflow not found' });
            }

            const { data: run, error: runError } = await ctx.supabase
                .from('workflow_runs')
                .insert({
                    workflow_id: input.id,
                    status: 'pending',
                    trigger_type: 'manual',
                    input_data: input.triggerData || {},
                })
                .select()
                .single();

            if (runError) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: runError.message });
            }

            // Simulate execution
            const simulateExecution = async () => {
                const nodes = (workflow?.definition as any)?.nodes || [];
                await ctx.supabase.from('workflow_runs').update({ status: 'running' }).eq('id', run.id);

                for (const node of nodes) {
                    await ctx.supabase.from('workflow_run_steps').insert({
                        run_id: run.id,
                        node_id: node.id,
                        node_type: node.type || 'action',
                        status: 'completed',
                        started_at: new Date().toISOString(),
                        completed_at: new Date().toISOString(),
                        duration_ms: Math.floor(Math.random() * 500)
                    });
                }

                await ctx.supabase.from('workflow_runs').update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    duration_ms: nodes.length * 500
                }).eq('id', run.id);

                await ctx.supabase.from('workflows').update({ last_run_at: new Date().toISOString() }).eq('id', input.id);
            };

            simulateExecution().catch(console.error);

            return run;
        }),

    // Get execution history
    getExecutions: protectedProcedure
        .input(
            z.object({
                workflowId: z.string(),
                limit: z.number().min(1).max(100).default(50),
                cursor: z.number().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const from = input.cursor || 0;
            const to = from + input.limit - 1;

            const { data, error, count } = await ctx.supabase
                .from('workflow_runs')
                .select('*', { count: 'exact' })
                .eq('workflow_id', input.workflowId)
                .order('started_at', { ascending: false })
                .range(from, to);

            if (error) {
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
            }

            return {
                executions: data || [],
                nextCursor: (data && data.length === input.limit) ? to + 1 : null,
                total: count
            };
        }),

    // Get single execution
    getExecutionById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('workflow_runs')
                .select('*, steps:workflow_run_steps(*)')
                .eq('id', input.id)
                .single();

            if (error) return null;
            return data;
        }),
});
