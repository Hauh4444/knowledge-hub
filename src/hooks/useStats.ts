import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserStats {
    resourcesCreated: number;
    totalViews: number;
    collaborationScore: number;
}

export const useStats = () => {
    const [stats, setStats] = useState<UserStats>({
        resourcesCreated: 0,
        totalViews: 0,
        collaborationScore: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: resources, error: resourcesError } = await supabase
                .from('resources')
                .select('views')
                .eq('author_id', user.id);

            if (resourcesError) throw resourcesError;

            const resourcesCreated = resources?.length || 0;
            const totalViews = resources?.reduce((sum, r) => sum + (r.views || 0), 0) || 0;

            const { data: collaborationScore, error: scoreError } = await supabase.rpc('get_collaboration_score', { user_id: user.id });
            if (scoreError) console.error('Error getting collaboration score:', scoreError);

            setStats({
                resourcesCreated,
                totalViews,
                collaborationScore: collaborationScore || 0
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    };
};