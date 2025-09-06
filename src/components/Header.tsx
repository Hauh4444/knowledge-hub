import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "./ui/dropdown-menu";
import { Bell, Settings, User, LogOut, BookOpen } from "lucide-react";
import { Badge } from "./ui/badge";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, profile, signOut } = useAuth();
    const { unreadCount } = useNotifications();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        const { error } = await signOut();

        if (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Signed out",
                description: "You have been signed out successfully",
            });
            navigate("/");
        }
    };

    const handleAuthAction = () => {
        navigate("/auth");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {user && <SidebarTrigger />}
                    <button
                        onClick={() => navigate(user ? "/dashboard" : "/")}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <div className="bg-gradient-primary p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                Knowledge Hub
                            </h1>
                        </div>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                                onClick={() => navigate("/notifications")}
                                title="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                    >
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </Badge>
                                )}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-gradient-secondary text-xs">
                                                {profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg z-50" align="end">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium">{profile?.name || 'User'}</p>
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={handleAuthAction}>
                                Sign In
                            </Button>
                            <Button onClick={handleAuthAction}>
                                Get Started
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;