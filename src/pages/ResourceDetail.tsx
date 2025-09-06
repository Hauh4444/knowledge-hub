import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ArrowLeft, Heart, Bookmark, Share2, Eye, MessageSquare, Clock, MoreHorizontal } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

interface Resource {
    id: string;
    title: string;
    description: string;
    content: string;
    author_id: string;
    tags: string[];
    views: number;
    likes: number;
    comments_count: number;
    read_time: string;
    created_at: string;
    updated_at: string;
    profiles?: {
        name: string;
        email: string;
        bio?: string;
    };
}

const ResourceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { smartBack, navigate } = useSmartNavigation();
    const { user } = useAuth();
    const { toast } = useToast();

    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (id) {
            fetchResource();
            if (user) {
                checkBookmarkStatus();
                incrementViewCount();
            }
        }
    }, [id, user]);

    const fetchResource = async () => {
        try {
            const { data, error } = await supabase
                .from('resources')
                .select(`
          *,
          profiles:author_id (
            name,
            email,
            bio
          )
        `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setResource(data);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Resource not found",
                variant: "destructive",
            });
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const checkBookmarkStatus = async () => {
        if (!user || !id) return;

        try {
            const { data } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('resource_id', id)
                .single();

            setIsBookmarked(!!data);
        } catch (error) {
            // Not bookmarked
        }
    };

    const incrementViewCount = async () => {
        if (!id) return;

        try {
            await supabase
                .from('resources')
                .update({ views: (resource?.views || 0) + 1 })
                .eq('id', id);
        } catch (error) {
            // Ignore view count errors
        }
    };

    const toggleBookmark = async () => {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please sign in to bookmark resources",
                variant: "destructive",
            });
            return;
        }

        try {
            if (isBookmarked) {
                await supabase
                    .from('bookmarks')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('resource_id', id);

                setIsBookmarked(false);
                toast({
                    title: "Bookmark removed",
                    description: "Resource removed from your bookmarks",
                });
            } else {
                await supabase
                    .from('bookmarks')
                    .insert([{ user_id: user.id, resource_id: id }]);

                setIsBookmarked(true);
                toast({
                    title: "Bookmarked",
                    description: "Resource added to your bookmarks",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update bookmark",
                variant: "destructive",
            });
        }
    };

    const shareResource = async () => {
        try {
            await navigator.share({
                title: resource?.title,
                text: resource?.description,
                url: window.location.href,
            });
        } catch (error) {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link copied",
                description: "Resource link copied to clipboard",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading resource...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Resource not found</p>
                        <Button onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={smartBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
                            <p className="text-muted-foreground">{resource.description}</p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-gradient-secondary">
                                            {resource.profiles?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{resource.profiles?.name || 'Anonymous'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(resource.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {resource.read_time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {resource.views}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Heart className="h-3 w-3" />
                                            {resource.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {resource.comments_count}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={toggleBookmark}
                                        >
                                            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={shareResource}
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {resource.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <Card>
                        <CardContent className="py-6">
                            <div className="prose max-w-none">
                                <div className="whitespace-pre-wrap leading-relaxed text-left">
                                    {resource.content}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {resource.profiles && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle>About the Author</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => toast({ title: "Profile viewed", description: "Viewing author profile" })}>
                                            View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: "Message sent", description: "Message sent to author" })}>
                                            Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toast({ title: "Following", description: "Now following this author" })}>
                                            Follow Author
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12 flex-shrink-0">
                                        <AvatarFallback className="bg-gradient-secondary">
                                            {resource.profiles.name?.split(' ').map(n => n[0]).join('') || 'A'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="text-center mb-3">
                                            <h4 className="font-semibold">{resource.profiles.name}</h4>
                                            <p className="text-sm text-muted-foreground">Author</p>
                                        </div>
                                        {resource.profiles.bio && (
                                            <p className="text-sm text-left leading-relaxed">{resource.profiles.bio}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceDetail;