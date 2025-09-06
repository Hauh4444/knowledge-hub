import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Users, Star, Eye } from "lucide-react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: "Welcome back!",
            });
            navigate("/dashboard");
        }

        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signUp(email, password, name);

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: "Account created! Please check your email to verify your account.",
            });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            Knowledge Hub
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Collaborate, share, and grow together
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="text-center p-4 bg-card/60 rounded-lg border">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">Share Knowledge</p>
                        </div>
                        <div className="text-center p-4 bg-card/60 rounded-lg border">
                            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">Collaborate</p>
                        </div>
                        <div className="text-center p-4 bg-card/60 rounded-lg border">
                            <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">Build Reputation</p>
                        </div>
                        <div className="text-center p-4 bg-card/60 rounded-lg border">
                            <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="text-sm font-medium">Discover Resources</p>
                        </div>
                    </div>
                </div>

                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle>Welcome</CardTitle>
                        <CardDescription>
                            Sign in to your account or create a new one
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
                                <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signin" className="space-y-4">
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email">Email</Label>
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <Input
                                            id="signin-password"
                                            type="password"
                                            placeholder="Your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup" className="space-y-4">
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name">Full Name</Label>
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="Create a password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Creating account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Auth;