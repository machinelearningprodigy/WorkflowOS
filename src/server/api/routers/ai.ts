// AI router - Handles AI-powered workflow generation and suggestions

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { hf, HF_MODEL } from '@/lib/huggingface';
import { TRPCError } from '@trpc/server';

const SYSTEM_PROMPT = `
You are an expert automation architect for WorkflowOS. 
Your goal is to convert user natural language descriptions into valid React Flow workflow graph definitions.

The output must be a valid JSON object with valid "nodes" and "edges" arrays.
Node Structure:
{
  "id": "unique_string",
  "type": "trigger" | "action" | "condition",
  "position": { "x": number, "y": number },
  "data": { "label": "string", "provider": "string" }
}

Edge Structure:
{
  "id": "e1-2",
  "source": "node_id",
  "target": "node_id"
}

Layout Rules:
- Start with a trigger node at top/left.
- Connect steps logically.
- Space nodes out (y += 100 or x += 250).

Output ONLY the JSON object. No markdown formatting.
`;

export const aiRouter = createTRPCRouter({
    // Generate workflow from natural language
    generateWorkflow: protectedProcedure
        .input(
            z.object({
                description: z.string().min(3).max(1000),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const response = await hf.chatCompletion({
                    model: HF_MODEL,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: `Create a workflow for: ${input.description}` }
                    ],
                    max_tokens: 2000,
                });

                const content = response.choices[0].message.content;

                if (!content) {
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "AI returned empty response" });
                }

                let graphData;
                try {
                    // Clean potential markdown blocks
                    const jsonStr = content.replace(/```json\n?|\n?```/g, "").trim();
                    graphData = JSON.parse(jsonStr);
                } catch (e) {
                    console.error("Failed to parse AI response", content);
                    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "AI generated invalid structure" });
                }

                // Create the workflow in DB
                const definition = {
                    nodes: graphData.nodes || [],
                    edges: graphData.edges || []
                };

                const { data, error } = await ctx.supabase
                    .from('workflows')
                    .insert({
                        user_id: ctx.user.id,
                        name: `AI: ${input.description.substring(0, 30)}...`,
                        description: input.description,
                        definition: definition,
                        is_active: false
                    })
                    .select()
                    .single();

                if (error) throw error;

                return data;

            } catch (error: any) {
                console.error("AI Generation Error:", error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message || "Failed to generate workflow"
                });
            }
        }),
});
