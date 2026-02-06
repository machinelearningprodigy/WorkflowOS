import { createClient } from '@/lib/supabase/server';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    created_at: string;
    link?: string;
}

export class NotificationService {
    async create(userId: string, data: Omit<Notification, 'id' | 'user_id' | 'read' | 'created_at'>) {
        const supabase = createClient();

        // We assume a 'notifications' table exists
        const { error } = await supabase.from('notifications').insert({
            user_id: userId,
            title: data.title,
            message: data.message,
            type: data.type || 'info',
            link: data.link,
            read: false,
        });

        if (error) {
            console.error('Failed to create notification', error);
        }
    }

    async markAsRead(notificationId: string) {
        const supabase = createClient();
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);
    }

    async markAllAsRead(userId: string) {
        const supabase = createClient();
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId);
    }

    async getUnreadCount(userId: string): Promise<number> {
        const supabase = createClient();
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('read', false);

        return count || 0;
    }
}

export const notificationService = new NotificationService();
