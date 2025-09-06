import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConnections } from "../hooks/useConnections";
import { useConversations } from "../hooks/useConversations";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import { supabase } from "../integrations/supabase/client";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, UserCheck, UserPlus, UserX, MessageSquare, Users, Clock, Check, X, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { CollaborationRatingDialog } from "../components/CollaborationRatingDialog";

const Collaborators = () => {
    const { smartBack, navigate } = useSmartNavigation();
    const { user } = useAuth();
    const { connections, loading, updateConnectionStatus } = useConnections();
    const { createOrGetConversation } = useConversations();

    const [processing, setProcessing] = useState<string | null>(null);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);

    const connectedUsers = connections.filter(conn => conn.status === 'accepted');
    const pendingReceived = connections.filter(conn =>
        conn.status === 'pending' && conn.addressee_id === user?.id
    );
    const pendingSent = connections.filter(conn =>
        conn.status === 'pending' && conn.requester_id === user?.id
    );

    const handleConnectionAction = async (connectionId: string, action: 'accepted' | 'declined') => {
        try {
            setProcessing(connectionId);
            await updateConnectionStatus(connectionId, action);
            toast.success(action === 'accepted' ? 'Connection accepted!' : 'Connection request declined');
        } catch (error: any) {
            toast.error("Failed to update connection");
        } finally {
            setProcessing(null);
        }
    };

    const removeCollaborator = async (connectionId: string, userName: string) => {
        try {
            setProcessing(connectionId);

            const connection = connections.find(conn => conn.id === connectionId);
            if (connection && user) {
                const otherUserId = connection.requester_id === user.id
                    ? connection.addressee_id
                    : connection.requester_id;

                await supabase
                    .from('conversations')
                    .delete()
                    .or(`and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`);
            }

            await updateConnectionStatus(connectionId, 'declined');
            toast.success(`Removed ${userName} from your collaborators and deleted conversation`);
        } catch (error: any) {
            toast.error("Failed to remove collaborator");
        } finally {
            setProcessing(null);
        }
    };

    const startConversation = (userId: string, userName: string) => {
        createOrGetConversation(userId).then((conversationId) => {
            navigate(`/messages/${conversationId}`);
        }).catch(() => {
            toast.error("Failed to start conversation");
        });
    };

    const openRatingDialog = (userId: string, userName: string) => {
        setSelectedUser({ id: userId, name: userName });
        setRatingDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading collaborators...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={smartBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <UserCheck className="h-6 w-6" />
                                My Collaborators
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your professional connections and collaboration requests
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="collaborators" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="collaborators" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Collaborators ({connectedUsers.length})
                            </TabsTrigger>
                            <TabsTrigger value="received" className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Requests ({pendingReceived.length})
                            </TabsTrigger>
                            <TabsTrigger value="sent" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Sent ({pendingSent.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="collaborators" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Collaborators</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        People you're connected with for collaboration
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {connectedUsers.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                            <h3 className="text-lg font-semibold mb-2">No collaborators yet</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Start building your professional network by connecting with others
                                            </p>
                                            <Button onClick={() => navigate('/find-collaborators')}>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Find Collaborators
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid lg:grid-cols-2 gap-4">
                                            {connectedUsers.map((connection) => {
                                                const isRequester = connection.requester_id === user?.id;
                                                const otherUser = isRequester ? connection.addressee_profile : connection.requester_profile;
                                                const otherUserId = isRequester ? connection.addressee_id : connection.requester_id;

                                                return (
                                                    <Card key={connection.id} className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4 space-y-4">
                                                            <div className="flex items-start gap-3">
                                                                <Avatar className="h-12 w-12">
                                                                    <AvatarFallback className="bg-gradient-secondary">
                                                                        {otherUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-medium truncate">{otherUser?.name || 'Unknown User'}</h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Connected {new Date(connection.created_at).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-2 w-full">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => navigate(`/user/${otherUserId}`)}
                                                                    className="flex-1"
                                                                >
                                                                    View Profile
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => startConversation(otherUserId, otherUser?.name || 'User')}
                                                                    className="flex-1"
                                                                >
                                                                    <MessageSquare className="h-3 w-3 mr-1" />
                                                                    Message
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => openRatingDialog(otherUserId, otherUser?.name || 'User')}
                                                                    className="flex-1"
                                                                >
                                                                    <Star className="h-3 w-3 mr-1" />
                                                                    Rate
                                                                </Button>
                                                            </div>

                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => removeCollaborator(connection.id, otherUser?.name || 'User')}
                                                                disabled={processing === connection.id}
                                                                className="w-full mt-2"
                                                            >
                                                                <Trash2 className="h-3 w-3 mr-1" />
                                                                Remove
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="received" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Connection Requests</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        People who want to connect with you
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {pendingReceived.length === 0 ? (
                                        <div className="text-center py-8">
                                            <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                            <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                                            <p className="text-muted-foreground">
                                                You don't have any connection requests at the moment
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingReceived.map((connection) => {
                                                const requester = connection.requester_profile;

                                                return (
                                                    <Card key={connection.id} className="border-l-4 border-l-primary">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-10 w-10">
                                                                        <AvatarFallback className="bg-gradient-secondary">
                                                                            {requester?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <h4 className="font-medium">{requester?.name || 'Unknown User'}</h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Sent {new Date(connection.created_at).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => navigate(`/user/${connection.requester_id}`)}
                                                                    >
                                                                        View Profile
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleConnectionAction(connection.id, 'declined')}
                                                                        disabled={processing === connection.id}
                                                                    >
                                                                        <X className="h-3 w-3 mr-1" />
                                                                        Decline
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleConnectionAction(connection.id, 'accepted')}
                                                                        disabled={processing === connection.id}
                                                                    >
                                                                        <Check className="h-3 w-3 mr-1" />
                                                                        Accept
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="sent" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sent Requests</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Connection requests you've sent that are waiting for a response
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {pendingSent.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                            <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                                            <p className="text-muted-foreground">
                                                You haven't sent any connection requests yet
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {pendingSent.map((connection) => {
                                                const addressee = connection.addressee_profile;

                                                return (
                                                    <Card key={connection.id}>
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-10 w-10">
                                                                        <AvatarFallback className="bg-gradient-secondary">
                                                                            {addressee?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <h4 className="font-medium">{addressee?.name || 'Unknown User'}</h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Sent {new Date(connection.created_at).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline">
                                                                        <Clock className="h-3 w-3 mr-1" />
                                                                        Pending
                                                                    </Badge>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => navigate(`/user/${connection.addressee_id}`)}
                                                                    >
                                                                        View Profile
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {selectedUser && (
                <CollaborationRatingDialog
                    isOpen={ratingDialogOpen}
                    onClose={() => {
                        setRatingDialogOpen(false);
                        setSelectedUser(null);
                    }}
                    userId={selectedUser.id}
                    userName={selectedUser.name}
                />
            )}
        </div>
    );
};

export default Collaborators;