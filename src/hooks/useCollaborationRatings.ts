import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CollaborationRating {
    id: string;
    rater_id: string;
    rated_user_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
}

export const useCollaborationRatings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const rateCollaborator = async (userId: string, rating: number, comment?: string) => {
        if (!user) throw new Error('Must be authenticated to rate collaborators');

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('collaboration_ratings')
                .upsert({
                    rater_id: user.id,
                    rated_user_id: userId,
                    rating,
                    comment: comment || null
                });

            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getCollaborationScore = async (userId: string): Promise<number> => {
        try {
            const { data, error } = await supabase.rpc('get_collaboration_score', { user_id: userId });

            if (error) throw error;
            return data || 0;
        } catch (err: any) {
            console.error('Error getting collaboration score:', err);
            return 0;
        }
    };

    const getUserRating = async (userId: string): Promise<CollaborationRating | null> => {
        if (!user) return null;

        try {
            const { data, error } = await supabase
                .from('collaboration_ratings')
                .select('*')
                .eq('rater_id', user.id)
                .eq('rated_user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (err: any) {
            console.error('Error getting user rating:', err);
            return null;
        }
    };

    return {
        rateCollaborator,
        getCollaborationScore,
        getUserRating,
        loading,
        error
    };
};