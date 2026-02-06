// User router - Handles user profile and settings operations

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
    // Get current user profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const { data, error } = await ctx.supabase
            .from('profiles')
            .select('*')
            .eq('id', ctx.user.id)
            .single();

        if (error) return null;
        return data;
    }),

    // Update user profile
    updateProfile: protectedProcedure
        .input(
            z.object({
                firstName: z.string().optional(),
                lastName: z.string().optional(),
                imageUrl: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('profiles')
                .update({
                    first_name: input.firstName,
                    last_name: input.lastName,
                    avatar_url: input.imageUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', ctx.user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        }),

    // Get user settings
    getSettings: protectedProcedure.query(async ({ ctx }) => {
        const { data, error } = await ctx.supabase
            .from('profiles')
            .select('settings')
            .eq('id', ctx.user.id)
            .single();

        if (error) return {};
        return data.settings || {};
    }),

    // Update user settings
    updateSettings: protectedProcedure
        .input(z.object({ settings: z.record(z.any()) }))
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('profiles')
                .update({
                    settings: input.settings,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', ctx.user.id)
                .select()
                .single();

            if (error) throw error;
            return data.settings;
        }),

    // Delete user account
    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
        const { error } = await ctx.supabase.auth.admin.deleteUser(ctx.user.id);
        if (error) throw error;
        return { success: true };
    }),
});
