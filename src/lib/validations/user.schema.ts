import { z } from "zod";

export const userProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address").optional(), // Often read-only
    avatar_url: z.string().url().optional().or(z.literal("")),
    bio: z.string().max(160).optional(),
});

export const userSettingsSchema = z.object({
    theme: z.enum(["light", "dark", "system"]).default("system"),
    email_notifications: z.boolean().default(true),
    marketing_emails: z.boolean().default(false),
    language: z.string().default("en"),
});

export const changePasswordSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export type UserProfileValues = z.infer<typeof userProfileSchema>;
export type UserSettingsValues = z.infer<typeof userSettingsSchema>;
