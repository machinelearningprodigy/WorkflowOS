import { createClient } from '@/lib/supabase/server';

export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    EXECUTE = 'EXECUTE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}

export class AuditService {
    static async log(userId: string, action: AuditAction, entity: string, entityId: string, metadata: any = {}) {
        const supabase = createClient();

        // Fire and forget - don't block main thread
        try {
            await supabase.from('audit_logs').insert({
                user_id: userId,
                action,
                entity,
                entity_id: entityId,
                metadata,
                created_at: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to log audit event:', error);
        }
    }
}
