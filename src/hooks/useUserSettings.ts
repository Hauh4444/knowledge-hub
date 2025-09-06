import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserSettings {
    pushNotifications: boolean;
    weeklyDigest: boolean;
    collaborationAlerts: boolean;
    publicProfile: boolean;
    analyticsTracking: boolean;
    darkModePreference: boolean | null;
}

export const useUserSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings>({
        publicProfile: true,
        pushNotifications: false,
        weeklyDigest: true,
        collaborationAlerts: true,
        analyticsTracking: true,
        darkModePreference: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadSettings();
        }
    }, [user]);

    const loadSettings = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading settings:', error);
                return;
            }

            if (data) {
                setSettings({
                    publicProfile: data.public_profile,
                    pushNotifications: data.push_notifications,
                    weeklyDigest: data.weekly_digest,
                    collaborationAlerts: data.collaboration_alerts,
                    analyticsTracking: data.analytics_tracking,
                    darkModePreference: data.dark_mode_preference,
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: keyof UserSettings, value: boolean | null) => {
        if (!user) return;

        setSettings(prev => ({ ...prev, [key]: value }));

        try {
            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

            const { data, error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    [dbKey]: value,
                }, {
                    onConflict: 'user_id'
                });

            if (error) {
                setSettings(prev => ({ ...prev, [key]: value === null ? null : !value }));
                throw error;
            }
        } catch (error) {
            console.error('Error updating setting:', error);
            setSettings(prev => ({ ...prev, [key]: value === null ? null : !value }));
            throw error;
        }
    };

    return {
        settings,
        loading,
        updateSetting
    };
};