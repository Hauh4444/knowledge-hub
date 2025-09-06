import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import { useAuth } from "../hooks/useAuth";
import { useConversations, useMessages } from "../hooks/useConversations";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ScrollArea } from "../components/ui/scroll-area";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Messages = () => {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const { smartBack, navigate } = useSmartNavigation();
    const { user } = useAuth();
    const { conversations, loading: conversationsLoading } = useConversations();
    const { messages, loading: messagesLoading, sendMessage } = useMessages(conversationId || null);

    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);

    const currentConversation = conversations.find(c => c.id === conversationId);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            await sendMessage(newMessage);
            setNewMessage("");
        } catch (error: any) {
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (conversationsLoading) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading conversations...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={smartBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-6 w-6" />
                                Messages
                            </h1>
                            <p className="text-muted-foreground">Chat with your connections</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Conversations</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[500px]">
                                    {conversations.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground">
                                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No conversations yet</p>
                                            <p className="text-xs">Start by messaging someone!</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {conversations.map((conversation) => (
                                                <button
                                                    key={conversation.id}
                                                    onClick={() => navigate(`/messages/${conversation.id}`)}
                                                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                                                        conversationId === conversation.id ? 'bg-muted' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-gradient-secondary">
                                                                {conversation.other_participant?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium truncate">
                                                                {conversation.other_participant?.name || 'Unknown User'}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {conversation.last_message?.content || 'No messages yet'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {conversation.last_message?.created_at ?
                                                                    new Date(conversation.last_message.created_at).toLocaleDateString() :
                                                                    new Date(conversation.created_at).toLocaleDateString()
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            {conversationId && currentConversation ? (
                                <>
                                    <CardHeader className="border-b">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-gradient-secondary">
                                                    {currentConversation.other_participant?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {currentConversation.other_participant?.name || 'Unknown User'}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">Online</p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-0 flex flex-col h-[500px]">
                                        <ScrollArea className="flex-1 p-4">
                                            {messagesLoading ? (
                                                <div className="text-center py-8">
                                                    <p className="text-muted-foreground">Loading messages...</p>
                                                </div>
                                            ) : messages.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                                    <p className="text-muted-foreground">No messages yet</p>
                                                    <p className="text-sm text-muted-foreground">Start the conversation!</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {messages.map((message) => (
                                                        <div
                                                            key={message.id}
                                                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-[70%] rounded-lg p-3 ${
                                                                    message.sender_id === user?.id
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted'
                                                                }`}
                                                            >
                                                                <p className="text-sm">{message.content}</p>
                                                                <p
                                                                    className={`text-xs mt-1 ${
                                                                        message.sender_id === user?.id
                                                                            ? 'text-primary-foreground/70'
                                                                            : 'text-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {new Date(message.created_at).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>

                                        <div className="border-t p-4">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Type your message..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    disabled={sending}
                                                />
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={!newMessage.trim() || sending}
                                                    size="icon"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </>
                            ) : (
                                <CardContent className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                        <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                                        <p className="text-muted-foreground">Choose a conversation from the sidebar to start chatting</p>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;