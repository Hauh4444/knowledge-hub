import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ArrowLeft, Activity as ActivityIcon, Heart, MessageSquare, BookOpen, Users, Plus } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";

interface ActivityItem {
    id: string;
    type: 'resource_created' | 'resource_liked' | 'resource_commented' | 'user_joined' | 'project_created';
    user_name: string;
    user_initials: string;
    action: string;
    target: string;
    timestamp: string;
}

const Activity = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            // Get recent resources created
            const { data: resources, error: resourcesError } = await supabase
                .from('resources')
                .select(`
          id,
          title,
          created_at,
          profiles:author_id (
            name,
            email
          )
        `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (resourcesError) throw resourcesError;

            // Transform to activity items
            const resourceActivities: ActivityItem[] = (resources || []).map(resource => ({
                id: resource.id,
                type: 'resource_created' as const,
                user_name: resource.profiles?.name || 'Anonymous',
                user_initials: resource.profiles?.name?.split(' ').map(n => n[0]).join('') || 'A',
                action: 'created',
                target: resource.title,
                timestamp: resource.created_at
            }));

            // Get recent users who joined
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, name, email, created_at')
                .order('created_at', { ascending: false })
                .limit(10);

            if (profilesError) throw profilesError;

            const userActivities: ActivityItem[] = (profiles || []).map(profile => ({
                id: `user_${profile.id}`,
                type: 'user_joined' as const,
                user_name: profile.name || 'New User',
                user_initials: profile.name?.split(' ').map(n => n[0]).join('') || 'N',
                action: 'joined',
                target: 'the community',
                timestamp: profile.created_at
            }));

            // Combine and sort all activities
            const allActivities = [...resourceActivities, ...userActivities]
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 50);

            setActivities(allActivities);
        } catch (error: any) {
            toast({
                title: "Oops! Something went wrong",
                description: "We couldn't load your activity feed right now. Please try again in a moment.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'resource_created':
                return <BookOpen className="h-4 w-4 text-blue-500" />;
            case 'resource_liked':
                return <Heart className="h-4 w-4 text-red-500" />;
            case 'resource_commented':
                return <MessageSquare className="h-4 w-4 text-green-500" />;
            case 'user_joined':
                return <Users className="h-4 w-4 text-purple-500" />;
            case 'project_created':
                return <Plus className="h-4 w-4 text-orange-500" />;
            default:
                return <ActivityIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'resource_created':
                return 'bg-accent border-accent-foreground/20';
            case 'resource_liked':
                return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/30';
            case 'resource_commented':
                return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/30';
            case 'user_joined':
                return 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/30';
            case 'project_created':
                return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/30';
            default:
                return 'bg-muted border-border';
        }
    };

    const timeAgo = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now.getTime() - time.getTime();

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <ActivityIcon className="h-6 w-6" />
                                Activity Feed
                            </h1>
                            <p className="text-muted-foreground">
                                Stay updated with the latest community activity
                            </p>
                        </div>
                    </div>

                    {/* Activity List */}
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading activity...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <ActivityIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                                <p className="text-muted-foreground">
                                    Activity will appear here as the community grows
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <Card
                                    key={activity.id}
                                    className={`transition-all duration-200 hover:shadow-md ${getActivityColor(activity.type)}`}
                                >
                                    <CardContent className="py-4">
                                        <div className="flex items-start gap-4">
                                            <div className="shrink-0 p-2 rounded-full bg-card border border-border">
                                                {getActivityIcon(activity.type)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <Avatar className="h-8 w-8 shrink-0">
                                                            <AvatarFallback className="bg-gradient-secondary text-xs">
                                                                {activity.user_initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="text-sm">
                                                                <span className="font-medium">{activity.user_name}</span>
                                                                <span className="text-muted-foreground"> {activity.action} </span>
                                                                <span className="font-medium text-primary truncate">{activity.target}</span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {timeAgo(activity.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Badge variant="outline" className="shrink-0 text-xs">
                                                        {activity.type.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {!loading && activities.length > 0 && (
                        <div className="text-center pt-8">
                            <Button variant="outline" onClick={fetchActivities}>
                                Refresh Activity
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activity;