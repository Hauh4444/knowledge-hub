import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useTheme } from 'next-themes';

export interface Profile {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    skills: string[];
    created_at: string;
    updated_at: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setTheme('light');

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    setTimeout(() => {
                        fetchProfile(session.user.id);
                        if (event === 'SIGNED_IN') {
                            handleThemeOnSignIn(session.user.id);
                        }
                    }, 0);
                } else {
                    setProfile(null);
                    setTheme('light');
                }
            }
        );

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchProfile(session.user.id);
                handleThemeOnSignIn(session.user.id);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleThemeOnSignIn = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('user_settings')
                .select('dark_mode_preference')
                .eq('user_id', userId)
                .single();

            if (data && data.dark_mode_preference !== null) {
                setTheme(data.dark_mode_preference ? 'dark' : 'light');
            } else {
                setTheme('light');
            }
        } catch (error) {
            console.error('Error checking theme preference:', error);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signUp = async (email: string, password: string, name: string) => {
        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    name: name
                }
            }
        });

        return { error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    return {
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut
    };
};