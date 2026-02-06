import { z } from "zod"

export const workflowSchema = z.object({
    name: z.string().min(2, {
        message: "Workflow name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    is_enabled: z.boolean().default(true),
    trigger_type: z.enum(["manual", "webhook", "schedule"]),
    cron_schedule: z.string().optional().refine((val) => {
        // Basic cron validation regex or use cron-parser lib
        if (!val) return true;
        return true; // Placeholder for robust check
    }, "Invalid cron schedule"),
})

export type WorkflowFormValues = z.infer<typeof workflowSchema>

export const workflowNodeSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.record(z.any()),
    position: z.object({
        x: z.number(),
        y: z.number()
    })
})

export const workflowGraphSchema = z.object({
    nodes: z.array(workflowNodeSchema),
    edges: z.array(z.any())
})
