import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
    TrendingUp,
    Clock,
    Users,
    Bookmark,
    Calendar,
    Award,
    Target,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { useProjectTasks } from "../hooks/useProjectTasks";
import { useTrendingTopics } from "../hooks/useTrendingTopics";

const Sidebar = () => {
    const navigate = useNavigate();
    const { activities, loading } = useRecentActivity();
    const { upcomingTasks, formatTimeUntilDue } = useProjectTasks();
    const { trendingTopics, loading: trendingLoading } = useTrendingTopics();

    return (
        <aside className="w-full space-y-6">
            <Card className="bg-gradient-subtle border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => navigate("/bookmarks")}
                    >
                        <Bookmark className="h-4 w-4 mr-2" />
                        View Bookmarks
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => navigate("/projects")}
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        Projects & Tasks
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        size="sm"
                        onClick={() => navigate("/find-collaborators")}
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Find Collaborators
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-card border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">Loading activity...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">No recent activity</p>
                        </div>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="flex flex-col space-y-1 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                                <div className="text-sm">
                                    <span className="font-medium">{activity.user}</span>
                                    <span className="text-muted-foreground"> {activity.action} </span>
                                    <span className="font-medium text-primary">{activity.resource}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                            </div>
                        ))
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-3 text-primary"
                        onClick={() => navigate("/activity")}
                    >
                        View All Activity <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-card border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Trending Topics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {trendingLoading ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">Loading trends...</p>
                            </div>
                        ) : trendingTopics.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">No trending topics yet</p>
                            </div>
                        ) : (
                            trendingTopics.map((topic, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <Badge variant="secondary" className="hover:bg-accent transition-colors cursor-pointer">
                                        {topic.name}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {topic.count} resource{topic.count !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Upcoming Deadlines
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {upcomingTasks.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                        </div>
                    ) : (
                        upcomingTasks.map((item) => (
                            <div key={item.id} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{item.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {item.projects?.name} • Due in {formatTimeUntilDue(item.deadline)}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        formatTimeUntilDue(item.deadline).includes('overdue') || formatTimeUntilDue(item.deadline) === 'Due today'
                                            ? 'destructive'
                                            : formatTimeUntilDue(item.deadline).includes('day') && !formatTimeUntilDue(item.deadline).includes('days')
                                                ? 'destructive'
                                                : 'secondary'
                                    }
                                    className="text-xs"
                                >
                                    {item.type === 'project' ? 'Project' : item.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        ))
                    )}
                    {upcomingTasks.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-3 text-primary"
                            onClick={() => navigate("/projects")}
                        >
                            View All Projects <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    )}
                </CardContent>
            </Card>
        </aside>
    );
};

export default Sidebar;