import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useNotifications = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        fetchUnreadCount();

        const channel = supabase
            .channel('notifications-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    fetchUnreadCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchUnreadCount = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('id')
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
            setUnreadCount(data?.length || 0);
        } catch (error) {
            console.error('Error fetching unread notifications:', error);
            setUnreadCount(0);
        }
    };

    return { unreadCount };
};