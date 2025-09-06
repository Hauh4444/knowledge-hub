import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Resource {
    id: string;
    title: string;
    description: string;
    content: string;
    author_id: string;
    tags: string[];
    views: number;
    likes: number;
    comments_count: number;
    read_time: string;
    created_at: string;
    updated_at: string;
    profiles?: {
        name: string;
    };
}

export const useResources = (searchTerm?: string, selectedTag?: string) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchResources();
    }, [searchTerm, selectedTag, user]);

    const fetchResources = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('resources')
                .select(`
                    *,
                    profiles:author_id (
                        name
                    )
                `)
                .order('created_at', { ascending: false });

            if (user) {
                query = query.neq('author_id', user.id);
            }

            if (searchTerm) {
                query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
            }

            if (selectedTag && selectedTag !== 'All Topics') {
                query = query.contains('tags', [selectedTag]);
            }

            const { data, error } = await query;

            if (error) throw error;
            setResources(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createResource = async (resourceData: { title: string; description: string; content: string; tags: string[]; read_time: string; }) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('resources')
                .insert([{
                    title: resourceData.title,
                    description: resourceData.description,
                    content: resourceData.content,
                    tags: resourceData.tags,
                    read_time: resourceData.read_time,
                    author_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;

            await fetchResources();
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const toggleBookmark = async (resourceId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data: existingBookmark } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('resource_id', resourceId)
                .single();

            if (existingBookmark) {
                await supabase
                    .from('bookmarks')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('resource_id', resourceId);
            } else {
                await supabase
                    .from('bookmarks')
                    .insert([{ user_id: user.id, resource_id: resourceId }]);
            }

            await fetchResources();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return {
        resources,
        loading,
        error,
        createResource,
        toggleBookmark,
        refetch: fetchResources
    };
};