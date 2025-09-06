import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { BookOpen, Eye, Heart, MessageSquare, Clock, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "../hooks/use-toast";

interface ResourceCardProps {
    title: string;
    description: string;
    author: {
        name: string;
        initials: string;
    };
    tags: string[];
    views: number;
    likes: number;
    comments: number;
    readTime: string;
    resourceId: string;
}

const ResourceCard = ({
    title,
    description,
    author,
    tags,
    views,
    likes,
    comments,
    readTime,
    resourceId,
}: ResourceCardProps) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            checkBookmarkStatus();
            checkLikeStatus();
        }
    }, [user, resourceId]);

    const checkLikeStatus = async () => {
        if (!user) return;

        try {
            const { data } = await supabase
                .from('likes')
                .select('id')
                .eq('user_id', user.id)
                .eq('resource_id', resourceId)
                .single();

            setIsLiked(!!data);
        } catch (error) {
            // Not liked
        }
    };

    const checkBookmarkStatus = async () => {
        if (!user) return;

        try {
            const { data } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('resource_id', resourceId)
                .single();

            setIsBookmarked(!!data);
        } catch (error) {
            // Not bookmarked
        }
    };

    const toggleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();

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
                    .eq('resource_id', resourceId);

                setIsBookmarked(false);
                toast({
                    title: "Bookmark removed",
                    description: "Resource removed from your bookmarks",
                });
            } else {
                await supabase
                    .from('bookmarks')
                    .insert([{ user_id: user.id, resource_id: resourceId }]);

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

    const toggleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please sign in to like resources",
                variant: "destructive",
            });
            return;
        }

        try {
            if (isLiked) {
                await supabase
                    .from('likes')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('resource_id', resourceId);

                setIsLiked(false);
                setLikeCount(prev => prev - 1);
                toast({
                    title: "Like removed",
                    description: "You unliked this resource",
                });
            } else {
                // Add like
                await supabase
                    .from('likes')
                    .insert([{ user_id: user.id, resource_id: resourceId }]);

                setIsLiked(true);
                setLikeCount(prev => prev + 1);
                toast({
                    title: "Liked",
                    description: "You liked this resource",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update like",
                variant: "destructive",
            });
        }
    };

    const handleCardClick = async () => {
        try {
            await supabase
                .from('resource_views')
                .insert([{
                    user_id: user?.id || null,
                    resource_id: resourceId
                }]);
        } catch (error) {
            // Ignore view tracking errors
        }

        navigate(`/resource/${resourceId}`);
    };

    return (
        <Card
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border border-border/50 hover:border-border shadow-sm cursor-pointer h-full flex flex-col"
            onClick={handleCardClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                            {description}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-3 flex-1">
                <div className="flex flex-wrap gap-2 mb-3 min-h-[1.5rem] overflow-hidden">
                    {tags.slice(0, 2).map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs hover:bg-accent transition-colors cursor-pointer bg-secondary/50 hover:bg-secondary/70 max-w-[120px] truncate"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {tags.length > 2 && (
                        <Badge variant="outline" className="text-xs shrink-0">
                            +{tags.length - 2}
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-3 mt-auto border-t bg-muted/20 dark:bg-muted/10">
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center w-full min-h-[1.5rem]">
                        <Avatar className="h-6 w-6 shrink-0 border border-border/20">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {author.initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground flex-1 text-center px-2 truncate">{author.name}</span>
                        <div className="flex items-center gap-1 text-xs shrink-0 text-muted-foreground">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span className="whitespace-nowrap">{readTime}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs min-w-0 justify-between text-muted-foreground min-h-[1.25rem]">
            <span className="flex items-center gap-1 shrink-0">
              <Eye className="h-3 w-3 shrink-0" />
              <span>{views}</span>
            </span>
                        <button
                            onClick={toggleLike}
                            className={`flex items-center gap-1 hover:text-primary transition-colors shrink-0 hover:scale-105 ${
                                isLiked ? 'text-red-500' : ''
                            }`}
                        >
                            <Heart className={`h-3 w-3 shrink-0 transition-all ${isLiked ? 'fill-current' : ''}`} />
                            <span>{likeCount}</span>
                        </button>
                        <span className="flex items-center gap-1 shrink-0">
              <MessageSquare className="h-3 w-3 shrink-0" />
              <span>{comments}</span>
            </span>
                        <button
                            onClick={toggleBookmark}
                            className={`flex items-center gap-1 hover:text-primary transition-colors shrink-0 hover:scale-105 ${
                                isBookmarked ? 'text-primary' : ''
                            }`}
                        >
                            <BookOpen className={`h-3 w-3 shrink-0 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default ResourceCard;