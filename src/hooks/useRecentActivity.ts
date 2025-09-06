import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityItem {
    id: string;
    user: string;
    action: string;
    resource: string;
    time: string;
    created_at: string;
}

export const useRecentActivity = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentActivity();
    }, []);

    const fetchRecentActivity = async () => {
        try {
            const { data: comments } = await supabase
                .from('comments')
                .select(`
                    id,
                    created_at,
                    resource_id,
                    profiles!inner(name),
                    resources!inner(title)
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            const { data: resources } = await supabase
                .from('resources')
                .select(`
                    id,
                    created_at,
                    title,
                    profiles!inner(name)
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            const activities: ActivityItem[] = [];

            if (comments) {
                comments.forEach(comment => {
                    activities.push({
                        id: `comment-${comment.id}`,
                        user: comment.profiles?.name || 'Anonymous',
                        action: 'commented on',
                        resource: comment.resources?.title || 'Unknown Resource',
                        time: formatTimeAgo(comment.created_at),
                        created_at: comment.created_at
                    });
                });
            }

            if (resources) {
                resources.forEach(resource => {
                    activities.push({
                        id: `resource-${resource.id}`,
                        user: resource.profiles?.name || 'Anonymous',
                        action: 'created',
                        resource: resource.title,
                        time: formatTimeAgo(resource.created_at),
                        created_at: resource.created_at
                    });
                });
            }

            const sortedActivities = activities
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 3);

            setActivities(sortedActivities);
        } catch (error) {
            console.error('Error fetching recent activity:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string): string => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    };

    return { activities, loading };
};