import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import ResourceCard from "../components/ResourceCard";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft, Bookmark, Grid, List } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";

interface BookmarkedResource {
    id: string;
    title: string;
    description: string;
    author_id: string;
    tags: string[];
    views: number;
    likes: number;
    comments_count: number;
    read_time: string;
    created_at: string;
    profiles?: {
        name: string;
        email: string;
    };
}

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkedResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            fetchBookmarks();
        }
    }, [user]);

    const fetchBookmarks = async () => {
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select(`
          resources (
            id,
            title,
            description,
            author_id,
            tags,
            views,
            likes,
            comments_count,
            read_time,
            created_at,
            profiles:author_id (
              name,
              email
            )
          )
        `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformedBookmarks = data?.map(bookmark => ({
                ...bookmark.resources,
                profiles: bookmark.resources?.profiles
            })).filter(Boolean) as BookmarkedResource[];

            setBookmarks(transformedBookmarks || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load bookmarks",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-2">
                                    <Bookmark className="h-6 w-6" />
                                    Bookmarks
                                </h1>
                                <p className="text-muted-foreground">
                                    Your saved resources for quick access
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="icon"
                                onClick={() => setViewMode("grid")}
                                className="h-8 w-8"
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="icon"
                                onClick={() => setViewMode("list")}
                                className="h-8 w-8"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading bookmarks...</p>
                        </div>
                    ) : bookmarks.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start bookmarking resources to see them here
                                </p>
                                <Link to="/dashboard">
                                    <Button>Discover Resources</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className={`grid gap-6 ${
                            viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                        }`}>
                            {bookmarks.map((resource, index) => (
                                <div key={resource.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <ResourceCard
                                        title={resource.title}
                                        description={resource.description || ''}
                                        author={{
                                            name: resource.profiles?.name || 'Anonymous',
                                            initials: resource.profiles?.name?.split(' ').map(n => n[0]).join('') || 'A'
                                        }}
                                        tags={resource.tags || []}
                                        views={resource.views || 0}
                                        likes={resource.likes || 0}
                                        comments={resource.comments_count || 0}
                                        readTime={resource.read_time || '5 min read'}
                                        resourceId={resource.id}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bookmarks;