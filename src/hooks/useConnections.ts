import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Connection {
    id: string;
    requester_id: string;
    addressee_id: string;
    status: 'pending' | 'accepted' | 'declined' | 'blocked';
    created_at: string;
    updated_at: string;
    requester_profile?: {
        name: string;
        avatar_url?: string;
    };
    addressee_profile?: {
        name: string;
        avatar_url?: string;
    };
}

export const useConnections = () => {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchConnections();
        }
    }, [user]);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('connections')
                .select('*')
                .or(`requester_id.eq.${user?.id},addressee_id.eq.${user?.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const connectionsWithProfiles = await Promise.all(
                (data || []).map(async (conn) => {
                    const [requesterProfile, addresseeProfile] = await Promise.all([
                        supabase.rpc('get_public_profile_data', { profile_id: conn.requester_id }),
                        supabase.rpc('get_public_profile_data', { profile_id: conn.addressee_id })
                    ]);

                    return {
                        ...conn,
                        status: conn.status as 'pending' | 'accepted' | 'declined' | 'blocked',
                        requester_profile: requesterProfile.data?.[0] ? {
                            name: requesterProfile.data[0].name,
                            avatar_url: requesterProfile.data[0].avatar_url
                        } : null,
                        addressee_profile: addresseeProfile.data?.[0] ? {
                            name: addresseeProfile.data[0].name,
                            avatar_url: addresseeProfile.data[0].avatar_url
                        } : null
                    };
                })
            );

            setConnections(connectionsWithProfiles);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sendConnectionRequest = async (addresseeId: string) => {
        if (!user) throw new Error('Not authenticated');

        try {
            const { data: existing } = await supabase
                .from('connections')
                .select('*')
                .or(`and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`)
                .single();

            if (existing) {
                throw new Error('Connection request already exists');
            }

            const { error } = await supabase
                .from('connections')
                .insert([{
                    requester_id: user.id,
                    addressee_id: addresseeId,
                    status: 'pending'
                }]);

            if (error) throw error;

            await supabase
                .from('notifications')
                .insert([{
                    user_id: addresseeId,
                    type: 'connection_request',
                    message: `${user.id} sent you a connection request`,
                    link: `/user/${user.id}`
                }]);

            await fetchConnections();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateConnectionStatus = async (connectionId: string, status: 'accepted' | 'declined' | 'blocked') => {
        try {
            const { error } = await supabase
                .from('connections')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', connectionId);

            if (error) throw error;

            if (status === 'accepted') {
                const connection = connections.find(c => c.id === connectionId);
                if (connection && user) {
                    const otherUserId = connection.requester_id === user.id ? connection.addressee_id : connection.requester_id;
                    await supabase
                        .from('notifications')
                        .insert([{
                            user_id: connection.requester_id,
                            type: 'connection_accepted',
                            message: `${user.id} accepted your connection request`,
                            link: `/user/${user.id}`
                        }]);
                }
            }

            await fetchConnections();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const getConnectionStatus = (otherUserId: string): 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'blocked' => {
        if (!user) return 'none';

        const connection = connections.find(conn =>
            (conn.requester_id === user.id && conn.addressee_id === otherUserId) ||
            (conn.requester_id === otherUserId && conn.addressee_id === user.id)
        );

        if (!connection) return 'none';

        if (connection.status === 'accepted') return 'connected';
        if (connection.status === 'blocked') return 'blocked';
        if (connection.status === 'pending') {
            return connection.requester_id === user.id ? 'pending_sent' : 'pending_received';
        }

        return 'none';
    };

    return {
        connections,
        loading,
        error,
        sendConnectionRequest,
        updateConnectionStatus,
        getConnectionStatus,
        refetch: fetchConnections
    };
};