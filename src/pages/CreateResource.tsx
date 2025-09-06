import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Save, Eye, X, Plus } from "lucide-react";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../integrations/supabase/client";

const CreateResource = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        tags: [] as string[],
        readTime: '5 min read'
    });
    const [newTag, setNewTag] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { user } = useAuth();
    const { smartBack, navigate } = useSmartNavigation();
    const { toast } = useToast();

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast({
                title: "Almost there!",
                description: "Don't forget to add a title and some content to your resource",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);

        try {
            const { data, error } = await supabase
                .from('resources')
                .insert([{
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    content: formData.content.trim(),
                    tags: formData.tags,
                    read_time: formData.readTime,
                    author_id: user?.id
                }])
                .select()
                .single();

            if (error) throw error;

            toast({
                title: "Success",
                description: "Resource created successfully!",
            });

            navigate('/dashboard');
        } catch (error: any) {
            toast({
                title: "Hmm, that didn't work",
                description: "We couldn't create your resource right now. Mind giving it another shot?",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const estimateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            content,
            readTime: estimateReadTime(content)
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={smartBack}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold">Create Resource</h1>
                                <p className="text-muted-foreground">
                                    Share your knowledge with the community
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsPreview(!isPreview)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                {isPreview ? 'Edit' : 'Preview'}
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Publish'}
                            </Button>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{isPreview ? 'Preview' : 'Resource Content'}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {isPreview ? (
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-2xl font-bold mb-2">{formData.title || 'Untitled Resource'}</h2>
                                                <p className="text-muted-foreground">{formData.description}</p>
                                            </div>

                                            {formData.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.tags.map((tag, index) => (
                                                        <Badge key={index} variant="secondary">{tag}</Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="prose max-w-none">
                                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                                    {formData.content || 'No content yet...'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Title *</Label>
                                                <Input
                                                    id="title"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                    placeholder="Enter a compelling title for your resource"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                    placeholder="Brief description of what this resource covers"
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="content">Content *</Label>
                                                <Textarea
                                                    id="content"
                                                    value={formData.content}
                                                    onChange={(e) => handleContentChange(e.target.value)}
                                                    placeholder="Write your content here... You can use markdown formatting."
                                                    rows={15}
                                                    className="min-h-[400px]"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Estimated read time: {formData.readTime}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Add a tag"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                        />
                                        <Button size="icon" onClick={addTag}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                                    onClick={() => removeTag(tag)}
                                                >
                                                    {tag} <X className="h-3 w-3 ml-1" />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <div className="text-xs text-muted-foreground">
                                        <p>Suggested tags:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Node.js'].map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="cursor-pointer text-xs hover:bg-accent"
                                                    onClick={() => {
                                                        if (!formData.tags.includes(tag)) {
                                                            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                                                        }
                                                    }}
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Publishing Tips</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-muted-foreground">
                                    <p>• Use a clear, descriptive title</p>
                                    <p>• Add relevant tags to help others find your content</p>
                                    <p>• Structure your content with headings and paragraphs</p>
                                    <p>• Include examples and practical tips</p>
                                    <p>• Preview before publishing</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateResource;