import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HelpArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    slug: string;
    description: string | null;
    tags: string[] | null;
    views: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export const useHelpArticles = (searchQuery?: string) => {
    const [articles, setArticles] = useState<HelpArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArticles();
    }, [searchQuery]);

    const loadArticles = async () => {
        try {
            let query = supabase
                .from('help_articles')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (searchQuery && searchQuery.trim()) {
                query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error loading help articles:', error);
                return;
            }

            setArticles(data || []);
        } catch (error) {
            console.error('Error loading help articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const getArticleBySlug = async (slug: string): Promise<HelpArticle | null> => {
        try {
            const { data, error } = await supabase
                .from('help_articles')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (error) {
                console.error('Error loading article:', error);
                return null;
            }

            await supabase
                .from('help_articles')
                .update({ views: (data.views || 0) + 1 })
                .eq('id', data.id);

            return data;
        } catch (error) {
            console.error('Error loading article:', error);
            return null;
        }
    };

    const getArticlesByCategory = (category: string): HelpArticle[] => {
        return articles.filter(article => article.category === category);
    };

    const getCategories = (): string[] => {
        const categories = articles.map(article => article.category);
        return Array.from(new Set(categories));
    };

    return {
        articles,
        loading,
        getArticleBySlug,
        getArticlesByCategory,
        getCategories,
        reload: loadArticles
    };
};