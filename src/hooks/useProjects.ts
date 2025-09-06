import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    members: string[];
    status: string;
    deadline: string | null;
    created_at: string;
    updated_at: string;
    profiles?: {
        name: string;
        email: string;
    };
}

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('projects')
                .select(`
          *,
          profiles:owner_id (
            name,
            email
          )
        `)
                .or(`owner_id.eq.${user.id},members.cs.{${user.id}}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData: { name: string; description: string; status?: string; members?: string[]; deadline?: string | null; }) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('projects')
                .insert([{
                    name: projectData.name,
                    description: projectData.description,
                    status: projectData.status || 'active',
                    deadline: projectData.deadline || null,
                    owner_id: user.id,
                    members: [user.id]
                }])
                .select()
                .single();

            if (error) throw error;

            await fetchProjects();
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateProject = async (projectId: string, updates: Partial<Project>) => {
        try {
            const { error } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', projectId);

            if (error) throw error;
            await fetchProjects();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        refetch: fetchProjects
    };
};