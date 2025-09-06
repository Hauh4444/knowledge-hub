import { Card, CardContent } from "./ui/card";
import { BookOpen, Users, Star } from "lucide-react";
import { useStats } from "../hooks/useStats";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
    return (
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 group h-full">
            <CardContent className="p-6 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between h-full flex-1">
                        <p className="text-muted-foreground text-sm font-medium">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300 ml-4">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const StatsOverview = () => {
    const { stats, loading } = useStats();

    const statsData = [
        {
            title: "Resources Created",
            value: loading ? "..." : stats.resourcesCreated.toString(),
            icon: <BookOpen className="h-5 w-5 text-primary" />
        },
        {
            title: "Collaboration Score",
            value: loading ? "..." : stats.collaborationScore.toString(),
            icon: <Users className="h-5 w-5 text-primary" />
        },
        {
            title: "Total Views",
            value: loading ? "..." : stats.totalViews.toLocaleString(),
            icon: <Star className="h-5 w-5 text-primary" />
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default StatsOverview;