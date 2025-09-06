import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    assignee_id: string | null;
    due_date: string | null;
    created_at: string;
    project_id: string;
    deadline: string;
    type?: string;
    projects?: {
        name: string;
    };
}

export const useProjectTasks = () => {
    const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchUpcomingTasks();
        }
    }, [user]);

    const fetchUpcomingTasks = async () => {
        if (!user) return;

        try {
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('id, name, deadline, status')
                .not('deadline', 'is', null)
                .neq('status', 'completed')
                .or(`owner_id.eq.${user.id},members.cs.{"${user.id}"}`)
                .order('deadline', { ascending: true })
                .limit(3);

            const { data: taskData, error: taskError } = await supabase
                .from('project_tasks')
                .select(`
          *,
          projects!inner(
            name,
            owner_id,
            members
          )
        `)
                .not('due_date', 'is', null)
                .neq('status', 'done')
                .or(`owner_id.eq.${user.id},members.cs.{"${user.id}"}`, { foreignTable: 'projects' })
                .order('due_date', { ascending: true })
                .limit(3);

            if (projectError) throw projectError;
            if (taskError) throw taskError;

            const allItems: any[] = [];

            if (projectData) {
                projectData.forEach(project => {
                    allItems.push({
                        id: `project-${project.id}`,
                        title: project.name,
                        type: 'project',
                        deadline: project.deadline,
                        projects: { name: project.name },
                        status: project.status
                    });
                });
            }

            if (taskData) {
                taskData.forEach(task => {
                    allItems.push({
                        ...task,
                        id: `task-${task.id}`,
                        type: 'task',
                        deadline: task.due_date
                    });
                });
            }

            const sortedItems = allItems
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 5);

            setUpcomingTasks(sortedItems);
        } catch (error) {
            console.error('Error fetching upcoming tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeUntilDue = (deadline: string): string => {
        const now = new Date();
        const due = new Date(deadline);
        const diffInDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) {
            return `${Math.abs(diffInDays)} days overdue`;
        } else if (diffInDays === 0) {
            return 'Due today';
        } else if (diffInDays === 1) {
            return '1 day';
        } else if (diffInDays <= 7) {
            return `${diffInDays} days`;
        } else if (diffInDays <= 30) {
            const weeks = Math.ceil(diffInDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''}`;
        } else {
            const months = Math.ceil(diffInDays / 30);
            return `${months} month${months > 1 ? 's' : ''}`;
        }
    };

    return {
        upcomingTasks,
        loading,
        formatTimeUntilDue,
        refetch: fetchUpcomingTasks
    };
};