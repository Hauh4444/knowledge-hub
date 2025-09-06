import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ArrowLeft, Calendar, Users, BookOpen, MessageSquare, UserPlus, Clock } from "lucide-react";
import { toast } from "../components/ui/sonner";
import { useConnections } from "../hooks/useConnections";
import { useConversations } from "../hooks/useConversations";
import { useCollaborationRatings } from "../hooks/useCollaborationRatings";

interface PublicProfile {
    id: string;
    name: string;
    avatar_url?: string;
    bio?: string;
    skills: string[];
    created_at: string;
}

interface UserStats {
    resourcesCreated: number;
    totalViews: number;
    collaborationScore: number;
}

const PublicProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { sendConnectionRequest, getConnectionStatus } = useConnections();
    const { createOrGetConversation } = useConversations();
    const { getCollaborationScore } = useCollaborationRatings();

    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [stats, setStats] = useState<UserStats>({ resourcesCreated: 0, totalViews: 0, collaborationScore: 0 });
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProfile();
            fetchStats();
            if (user && id !== user.id) {
                checkConnectionStatus();
            }
        }
    }, [id]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase.rpc('get_public_profile_data', { profile_id: id });

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error('Profile not found');
            }

            setProfile(data[0]);
        } catch (error: any) {
            toast.error("Profile not found");
            navigate('/find-collaborators');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const { data: resources, error: resourcesError } = await supabase
                .from('resources')
                .select('views')
                .eq('author_id', id);

            if (resourcesError) throw resourcesError;

            const resourcesCreated = resources?.length || 0;
            const totalViews = resources?.reduce((sum, r) => sum + (r.views || 0), 0) || 0;

            const collaborationScore = await getCollaborationScore(id);

            setStats({
                resourcesCreated,
                totalViews,
                collaborationScore
            });
        } catch (err: any) {
            console.error('Error fetching stats:', err);
        }
    };

    const checkConnectionStatus = async () => {
        if (!id || !user) return;
        try {
            const status = await getConnectionStatus(id);
            setConnectionStatus(status);
        } catch (error) {
            console.error('Error checking connection status:', error);
        }
    };

    const sendConnectionRequestHandler = async () => {
        if (!id || !profile) return;
        try {
            await sendConnectionRequest(id);
            toast.success(`Connection request sent to ${profile.name}!`);
            setConnectionStatus('pending');
        } catch (error: any) {
            toast.error(error.message || "Failed to send connection request");
        }
    };

    const startConversation = async () => {
        if (!id || !profile) return;
        try {
            const conversationId = await createOrGetConversation(id);
            navigate(`/messages/${conversationId}`);
            toast.success(`Started conversation with ${profile.name}!`);
        } catch (error: any) {
            toast.error(error.message || "Failed to start conversation");
        }
    };

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? `Unfollowed ${profile?.name}` : `Now following ${profile?.name}!`);
        // TODO: Implement actual follow functionality
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Profile not found</p>
                        <Button onClick={() => navigate('/find-collaborators')}>
                            Back to Collaborators
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const isOwnProfile = user?.id === profile.id;

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/find-collaborators')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">Profile</h1>
                            <p className="text-muted-foreground">
                                {isOwnProfile ? 'Your public profile' : `${profile.name}'s profile`}
                            </p>
                        </div>
                        {!isOwnProfile && (
                            <div className="flex gap-2">
                                <Button onClick={toggleFollow} variant={isFollowing ? "outline" : "default"}>
                                    <Users className="h-4 w-4 mr-2" />
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                                {connectionStatus !== 'accepted' && connectionStatus !== 'pending' && (
                                    <Button onClick={sendConnectionRequestHandler}>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Connect
                                    </Button>
                                )}
                                {connectionStatus === 'pending' && (
                                    <Button variant="outline" disabled>
                                        <Clock className="h-4 w-4 mr-2" />
                                        Pending
                                    </Button>
                                )}
                                {connectionStatus === 'accepted' && (
                                    <Button onClick={startConversation} variant="outline">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Message
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-6">
                                        <Avatar className="h-24 w-24">
                                            <AvatarFallback className="bg-gradient-secondary text-2xl">
                                                {profile.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                Joined {new Date(profile.created_at).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            </div>
                                            {profile.bio && (
                                                <p className="text-muted-foreground leading-relaxed text-left">
                                                    {profile.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {profile.skills && profile.skills.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Skills & Expertise</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map((skill, index) => (
                                                <Badge key={index} variant="secondary" className="px-3 py-1">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Resources Created</span>
                                        </div>
                                        <span className="font-semibold">{stats.resourcesCreated}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Total Views</span>
                                        </div>
                                        <span className="font-semibold">{stats.totalViews}</span>
                                    </div>


                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Collaboration Score</span>
                                        </div>
                                        <span className="font-semibold">{stats.collaborationScore}/5</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {isOwnProfile && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={() => navigate('/profile')}
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            className="w-full justify-start"
                                            variant="outline"
                                            onClick={() => navigate('/settings')}
                                        >
                                            Account Settings
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;