import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TrendingTopic {
    name: string;
    count: number;
}

export const useTrendingTopics = () => {
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrendingTopics();
    }, []);

    const loadTrendingTopics = async () => {
        try {
            const { data: resources, error } = await supabase
                .from('resources')
                .select('tags')
                .not('tags', 'is', null);

            if (error) {
                console.error('Error loading trending topics:', error);
                return;
            }

            const tagCounts: { [key: string]: number } = {};

            resources.forEach(resource => {
                if (resource.tags && Array.isArray(resource.tags)) {
                    resource.tags.forEach((tag: string) => {
                        if (typeof tag === 'string' && tag.trim()) {
                            const normalizedTag = tag.trim();
                            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
                        }
                    });
                }
            });

            const topicsArray = Object.entries(tagCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setTrendingTopics(topicsArray);
        } catch (error) {
            console.error('Error loading trending topics:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        trendingTopics,
        loading,
        reload: loadTrendingTopics
    };
};