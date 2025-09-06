import { useState, useEffect } from "react";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, Eye, Heart, MessageSquare, Clock } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface Resource {
    id: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    views: number;
    likes: number;
    comments_count: number;
    read_time: string;
    created_at: string;
    updated_at: string;
}

const ManageResources = () => {
    const { user } = useAuth();
    const { smartBack, navigate } = useSmartNavigation();
    const { toast } = useToast();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        content: '',
        tags: [] as string[],
        read_time: ''
    });

    useEffect(() => {
        if (user) {
            fetchResources();
        }
    }, [user]);

    const fetchResources = async () => {
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .eq('author_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setResources(data || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load resources",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteResource = async (resourceId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('resources')
                .delete()
                .eq('id', resourceId);

            if (error) throw error;

            setResources(resources.filter(r => r.id !== resourceId));
            toast({
                title: "Success",
                description: "Resource deleted successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to delete resource",
                variant: "destructive",
            });
        }
    };

    const openEditDialog = (resource: Resource) => {
        setEditingResource(resource);
        setEditForm({
            title: resource.title,
            description: resource.description,
            content: resource.content,
            tags: resource.tags || [],
            read_time: resource.read_time || ''
        });
    };

    const updateResource = async () => {
        if (!editingResource) return;

        try {
            const { error } = await supabase
                .from('resources')
                .update({
                    title: editForm.title,
                    description: editForm.description,
                    content: editForm.content,
                    tags: editForm.tags,
                    read_time: editForm.read_time
                })
                .eq('id', editingResource.id);

            if (error) throw error;

            setEditingResource(null);
            fetchResources();
            toast({
                title: "Success",
                description: "Resource updated successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update resource",
                variant: "destructive",
            });
        }
    };

    const addTag = (tag: string) => {
        if (tag && !editForm.tags.includes(tag)) {
            setEditForm(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setEditForm(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading your resources...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={smartBack}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">My Resources</h1>
                                <p className="text-muted-foreground">
                                    Manage and edit your published resources
                                </p>
                            </div>
                        </div>

                        <Button onClick={() => navigate('/create-resource')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Resource
                        </Button>
                    </div>

                    {resources.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first resource to share knowledge with the community
                            </p>
                            <Button onClick={() => navigate('/create-resource')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Resource
                            </Button>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {resources.map((resource) => (
                                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg line-clamp-2 flex-1 mr-2">
                                                {resource.title}
                                            </CardTitle>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(resource)}
                                                    className="h-8 w-8"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteResource(resource.id, resource.title)}
                                                    className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {resource.description}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {resource.tags && resource.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {resource.tags.slice(0, 3).map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {resource.tags.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{resource.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center gap-3">
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
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {resource.read_time}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/resource/${resource.id}`)}
                                                className="flex-1"
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(resource)}
                                                className="flex-1"
                                            >
                                                Edit
                                            </Button>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Created: {new Date(resource.created_at).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {editingResource && (
                        <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Edit Resource</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            value={editForm.title}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="Resource title"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea
                                            value={editForm.description}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Brief description"
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Content</label>
                                        <Textarea
                                            value={editForm.content}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                                            placeholder="Resource content"
                                            rows={8}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Read Time</label>
                                        <Input
                                            value={editForm.read_time}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, read_time: e.target.value }))}
                                            placeholder="e.g., 5 min read"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Tags</label>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {editForm.tags.map((tag, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                                        onClick={() => removeTag(tag)}
                                                    >
                                                        {tag} ×
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Input
                                                placeholder="Add a tag and press Enter"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        addTag(e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setEditingResource(null)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={updateResource}>
                                            Update Resource
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageResources;