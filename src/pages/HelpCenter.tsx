import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHelpArticles } from "../hooks/useHelpArticles";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Search, HelpCircle, BookOpen, MessageCircle, Shield, Users, Zap } from "lucide-react";

const HelpCenter = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const { articles, loading, getCategories, getArticlesByCategory } = useHelpArticles(debouncedQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const categories = getCategories();
    const categoryData = categories.map(category => ({
        title: category,
        description: getCategoryDescription(category),
        icon: getCategoryIcon(category),
        articles: getArticlesByCategory(category)
    }));

    const popularArticles = articles
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    const filteredCategories = searchQuery
        ? categoryData.filter(category =>
            category.articles.length > 0 ||
            category.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : categoryData;

    function getCategoryDescription(category: string): string {
        const descriptions: { [key: string]: string } = {
            "Getting Started": "Learn the basics of using our platform",
            "Resources & Content": "Managing your resources and content",
            "Collaboration": "Working with team members and collaborators",
            "Privacy & Security": "Account security and privacy settings",
            "Advanced Features": "Make the most of our platform"
        };
        return descriptions[category] || "Learn more about this topic";
    }

    function getCategoryIcon(category: string) {
        const icons: { [key: string]: any } = {
            "Getting Started": BookOpen,
            "Resources & Content": MessageCircle,
            "Collaboration": Users,
            "Privacy & Security": Shield,
            "Advanced Features": Zap
        };
        return icons[category] || BookOpen;
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/settings">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <HelpCircle className="h-6 w-6" />
                                Help Center
                            </h1>
                            <p className="text-muted-foreground">
                                Find answers to your questions and learn how to make the most of our platform
                            </p>
                        </div>
                    </div>

                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="relative max-w-md mx-auto">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search for help articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {!searchQuery && !loading && popularArticles.length > 0 && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Popular Articles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {popularArticles.map((article, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="w-full justify-start text-left h-auto p-3"
                                            onClick={() => navigate(`/help/${article.slug}`)}
                                        >
                                            <div>
                                                <p className="font-medium">{article.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {article.description || "Learn more about this topic"}
                                                </p>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-lg">Loading help articles...</div>
                        </div>
                    )}

                    {!loading && searchQuery && articles.length === 0 && (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-muted-foreground">
                                    No articles found matching "{searchQuery}". Try different keywords or browse categories below.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {!loading && searchQuery && articles.length > 0 && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>Search Results ({articles.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {articles.map((article) => (
                                        <Button
                                            key={article.id}
                                            variant="ghost"
                                            className="w-full justify-start text-left h-auto p-3"
                                            onClick={() => navigate(`/help/${article.slug}`)}
                                        >
                                            <div>
                                                <p className="font-medium">{article.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {article.description || "Learn more about this topic"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {article.category}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {article.views} views
                                                    </span>
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!loading && !searchQuery && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCategories.map((category, index) => (
                                <Card key={index} className="hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <category.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{category.title}</CardTitle>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {category.articles.slice(0, 4).map((article, articleIndex) => (
                                                <Button
                                                    key={articleIndex}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start text-left h-auto p-2"
                                                    onClick={() => navigate(`/help/${article.slug}`)}
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">{article.title}</p>
                                                    </div>
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <Badge variant="secondary" className="text-xs">
                                                {category.articles.length} article{category.articles.length !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Card className="mt-8">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
                            <p className="text-muted-foreground mb-4">
                                Can't find what you're looking for? Our support team is here to help.
                            </p>
                            <Link to="/contact-support">
                                <Button>Contact Support</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;