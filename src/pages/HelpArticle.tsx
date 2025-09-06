import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useHelpArticles } from "../hooks/useHelpArticles";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Clock, Eye, HelpCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

const HelpArticle = () => {
    const { slug } = useParams<{ slug: string }>();
    const { getArticleBySlug } = useHelpArticles();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (slug) {
            loadArticle();
        }
    }, [slug]);

    const loadArticle = async () => {
        if (!slug) return;

        try {
            const articleData = await getArticleBySlug(slug);
            if (articleData) {
                setArticle(articleData);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error('Error loading article:', error);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-center items-center py-12">
                            <div className="text-lg">Loading article...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !article) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <Link to="/help-center">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">Article Not Found</h1>
                            </div>
                        </div>
                        <Card>
                            <CardContent className="p-8 text-center">
                                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h2 className="text-xl font-semibold mb-2">Article Not Found</h2>
                                <p className="text-muted-foreground mb-6">
                                    The help article you're looking for doesn't exist or has been removed.
                                </p>
                                <Link to="/help-center">
                                    <Button>Back to Help Center</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/help-center">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{article.category}</Badge>
                                {article.tags && article.tags.map((tag: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <h1 className="text-3xl font-bold">{article.title}</h1>
                            {article.description && (
                                <p className="text-muted-foreground mt-2">
                                    {article.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Last updated {new Date(article.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-8 text-left">
                            <div className="prose prose-lg max-w-none dark:prose-invert">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-8 first:mt-0">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>,
                                        h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
                                        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                                        pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                                    }}
                                >
                                    {article.content}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center">
                        <Link to="/help-center">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Help Center
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpArticle;