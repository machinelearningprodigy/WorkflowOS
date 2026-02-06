import { z } from "zod"

/**
 * Common Zod validation schemas for the application.
 */
export const validation = {
    email: z.string().email("Please enter a valid email address."),
    password: z.string()
        .min(8, "Password must be at least 8 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number."),
    url: z.string().url("Please enter a valid URL."),
    name: z.string().min(2, "Name must be at least 2 characters.").max(50),
    slug: z.string().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),

    // Workflow related
    workflowName: z.string().min(3, "Workflow name is required.").max(100),
    integrationName: z.string().min(1, "Integration name is required."),

    // Auth related
    login: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),

    signup: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
    })
}
