import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useResources } from "../hooks/useResources";
import Sidebar from "../components/Sidebar";
import StatsOverview from "../components/StatsOverview";
import ResourceCard from "../components/ResourceCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Search, Grid, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

const Dashboard = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("All Topics");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { profile } = useAuth();
    const { resources, loading } = useResources(searchTerm, selectedTag);
    const navigate = useNavigate();
    const { toast } = useToast();

    const filterOptions = ["All Topics", "React", "TypeScript", "Design Systems", "Security", "CSS", "Architecture", "Frontend", "API", "Performance", "JavaScript", "UI/UX"];

    const handleCreateResource = () => {
        navigate("/create-resource");
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setPage(1);
        setHasMore(true);
    };

    const handleLoadMore = () => {
        if (resources.length < 20) {
            setHasMore(false);
            toast({
                title: "All loaded",
                description: "You've seen all available resources!",
            });
            return;
        }

        setPage(prev => prev + 1);
        toast({
            title: "Loading more",
            description: "Fetching additional resources...",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8 min-w-0">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                    Good morning, {profile?.name || 'User'}! 👋
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Ready to share knowledge and collaborate? Here's what's happening in your network.
                                </p>
                            </div>

                            <StatsOverview />
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-semibold">Discover Resources</h3>
                                    <p className="text-muted-foreground mt-1">
                                        Curated knowledge from your professional network
                                    </p>
                                </div>
                                <Button
                                    className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
                                    onClick={handleCreateResource}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Resource
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search resources..."
                                            className="pl-10 w-64 bg-background border-border/50"
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </div>

                                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto bg-background border border-border shadow-lg z-50">
                                            {filterOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                <div className="flex justify-center items-center py-12">
                                    <div className="text-muted-foreground">Loading resources...</div>
                                </div>
                            ) : (
                                <div className={`grid gap-6 ${
                                    viewMode === "grid"
                                        ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                                        : "grid-cols-1"
                                }`}>
                                    {resources.map((resource, index) => (
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

                            {!loading && resources.length > 0 && hasMore && (
                                <div className="flex justify-center pt-8">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="hover:bg-muted"
                                        onClick={handleLoadMore}
                                    >
                                        Load More Resources
                                    </Button>
                                </div>
                            )}

                            {!loading && resources.length > 0 && !hasMore && (
                                <div className="text-center pt-8">
                                    <p className="text-muted-foreground">You've seen all available resources!</p>
                                </div>
                            )}

                            {!loading && resources.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">
                                        Hmm, we couldn't find any resources matching your search.
                                        Try tweaking your filters or search terms.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:w-80 shrink-0">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;