/**
 * User related types and interfaces.
 */

export type UserRole = 'owner' | 'admin' | 'developer' | 'viewer';

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role: UserRole;
    orgId: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserNotificationSettings {
    workflowSuccess: boolean;
    workflowError: boolean;
    billingAlerts: boolean;
    marketingEmails: boolean;
}

export interface UserSession {
    user: User;
    expires: string;
}
