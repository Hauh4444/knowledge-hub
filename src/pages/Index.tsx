import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { BookOpen, Users, Star, TrendingUp, Shield, Zap } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import heroImage from "../assets/hero-collaboration.jpg";

const Index = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleAuthAction = () => {
        navigate("/auth");
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-primary p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                Knowledge Hub
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={handleAuthAction}>
                                Sign In
                            </Button>
                            <Button onClick={handleAuthAction}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <section className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-bold leading-tight">
                                Collaborate on{" "}
                                <span className="bg-gradient-primary bg-clip-text text-transparent">
                                    Knowledge
                                </span>{" "}
                                Like Never Before
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Create, share, and collaborate on structured knowledge resources with your team.
                                Turn collective intelligence into actionable insights with our professional platform.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/auth">
                                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                                    Start Collaborating
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" onClick={() => {
                                toast({
                                    title: "Demo Coming Soon",
                                    description: "Watch our product demo - feature coming soon!",
                                });
                            }}>
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">10K+</div>
                                <div className="text-sm text-muted-foreground">Resources Shared</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">5K+</div>
                                <div className="text-sm text-muted-foreground">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">99%</div>
                                <div className="text-sm text-muted-foreground">Uptime</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gradient-primary/10 rounded-2xl p-8">
                            <img
                                src={heroImage}
                                alt="Team collaboration"
                                className="rounded-xl shadow-2xl w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20">
                <div className="text-center space-y-4 mb-16">
                    <h3 className="text-3xl font-bold">Everything you need to build knowledge</h3>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed for professional teams who value structured knowledge sharing
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="border-0 shadow-sm bg-card/60 hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Rich Knowledge Resources</CardTitle>
                            <CardDescription>
                                Create comprehensive guides, case studies, and templates with our intuitive editor
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-0 shadow-sm bg-card/60 hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Real-time Collaboration</CardTitle>
                            <CardDescription>
                                Work together seamlessly with live editing, comments, and project spaces
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-0 shadow-sm bg-card/60 hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Smart Analytics</CardTitle>
                            <CardDescription>
                                Track engagement, measure impact, and optimize your knowledge sharing strategy
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-0 shadow-sm bg-card/60 hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <Star className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Collaboration Scoring</CardTitle>
                            <CardDescription>
                                Build credibility and recognition through quality contributions and peer reviews
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-0 shadow-sm bg-card/60 hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Enterprise Security</CardTitle>
                            <CardDescription>
                                Bank-level security with SSO, advanced permissions, and compliance ready
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-0 shadow-sm bg-card/60 hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-lg w-fit">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>AI-Powered Insights</CardTitle>
                            <CardDescription>
                                Get intelligent recommendations and automate knowledge discovery workflows
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20">
                <div className="bg-gradient-primary/5 rounded-2xl p-12 text-center">
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-bold">Ready to transform your team's knowledge?</h3>
                        <p className="text-lg text-muted-foreground">
                            Join thousands of professionals already collaborating on Knowledge Hub
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/auth">
                                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                                    Start Free Today
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" onClick={() => {
                                toast({
                                    title: "Schedule Demo",
                                    description: "Demo scheduling feature coming soon!",
                                });
                            }}>
                                Schedule Demo
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;