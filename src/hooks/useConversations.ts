import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Conversation {
    id: string;
    participant_1: string;
    participant_2: string;
    created_at: string;
    updated_at: string;
    last_message_at: string;
    other_participant?: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    last_message?: {
        content: string;
        sender_id: string;
        created_at: string;
    };
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
    sender?: {
        name: string;
        avatar_url?: string;
    };
}

export const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    messages:messages(content, sender_id, created_at)
                `)
                .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
                .order('last_message_at', { ascending: false });

            if (error) throw error;

            const conversationsWithProfiles = await Promise.all(
                (data || [])
                    .filter(conv => conv.participant_1 !== conv.participant_2) // Filter out self-conversations
                    .map(async (conv) => {
                        const otherParticipantId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;

                        if (otherParticipantId === user.id) {
                            return null;
                        }

                        const { data: profileData } = await supabase.rpc('get_public_profile_data', {
                            profile_id: otherParticipantId
                        });

                        const lastMessage = conv.messages && conv.messages.length > 0
                            ? conv.messages[conv.messages.length - 1]
                            : null;

                        return {
                            ...conv,
                            other_participant: profileData?.[0] ? {
                                id: otherParticipantId,
                                name: profileData[0].name,
                                avatar_url: profileData[0].avatar_url
                            } : null,
                            last_message: lastMessage
                        };
                    })
            );

            const validConversations = conversationsWithProfiles.filter(conv =>
                conv !== null && conv.other_participant && conv.other_participant.id !== user.id
            );

            setConversations(validConversations);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createOrGetConversation = async (otherUserId: string): Promise<string> => {
        if (!user) throw new Error('Not authenticated');

        try {
            const { data: existing } = await supabase
                .from('conversations')
                .select('id')
                .or(`and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`)
                .single();

            if (existing) {
                return existing.id;
            }

            const { data, error } = await supabase
                .from('conversations')
                .insert([{
                    participant_1: user.id,
                    participant_2: otherUserId
                }])
                .select('id')
                .single();

            if (error) throw error;
            await fetchConversations();
            return data.id;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        conversations,
        loading,
        error,
        createOrGetConversation,
        refetch: fetchConversations
    };
};

export const useMessages = (conversationId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (conversationId) {
            fetchMessages();
        }
    }, [conversationId]);

    const fetchMessages = async () => {
        if (!conversationId) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const messagesWithProfiles = await Promise.all(
                (data || []).map(async (message) => {
                    const { data: profileData } = await supabase.rpc('get_public_profile_data', {
                        profile_id: message.sender_id
                    });

                    return {
                        ...message,
                        sender: profileData?.[0] ? {
                            name: profileData[0].name,
                            avatar_url: profileData[0].avatar_url
                        } : null
                    };
                })
            );

            setMessages(messagesWithProfiles);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        if (!user || !conversationId) throw new Error('Not authenticated or no conversation');

        try {
            const { error } = await supabase
                .from('messages')
                .insert([{
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content: content.trim()
                }]);

            if (error) throw error;
            await fetchMessages();
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const markAsRead = async (messageId: string) => {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', messageId)
                .neq('sender_id', user?.id);

            if (error) throw error;
            await fetchMessages();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return {
        messages,
        loading,
        error,
        sendMessage,
        markAsRead,
        refetch: fetchMessages
    };
};