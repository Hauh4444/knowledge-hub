import {
    Home,
    Search,
    FileText,
    Users,
    MessageSquare,
    FolderOpen,
    Bookmark,
    Activity,
    UserCheck,
    Settings,
    User,
    PlusCircle,
    HelpCircle
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Find Resources", url: "/dashboard", icon: Search },
    { title: "Create Resource", url: "/create-resource", icon: PlusCircle },
    { title: "My Resources", url: "/manage-resources", icon: FileText },
];

const collaborationItems = [
    { title: "Find Collaborators", url: "/find-collaborators", icon: Users },
    { title: "My Collaborators", url: "/collaborators", icon: UserCheck },
    { title: "Messages", url: "/messages", icon: MessageSquare },
];

const projectItems = [
    { title: "Projects", url: "/projects", icon: FolderOpen },
    { title: "Activity", url: "/activity", icon: Activity },
    { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
];

const accountItems = [
    { title: "Profile", url: "/profile", icon: User },
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "Help Center", url: "/help-center", icon: HelpCircle },
];

export function AppSidebar() {
    const { state } = useSidebar();
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        if (path === "/dashboard") {
            return currentPath === "/" || currentPath === "/dashboard";
        }
        return currentPath === path || currentPath.startsWith(path + "/");
    };

    const getNavClassName = (path: string) => {
        return isActive(path)
            ? "bg-primary/10 text-primary border-r-2 border-primary font-medium"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground";
    };

    const isCollapsed = state === "collapsed";

    return (
        <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
            <SidebarContent className="gap-0">
                <SidebarGroup>
                    <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
                        Main
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="h-10">
                                        <NavLink
                                            to={item.url}
                                            className={getNavClassName(item.url)}
                                            title={item.title}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
                        Collaboration
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {collaborationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="h-10">
                                        <NavLink
                                            to={item.url}
                                            className={getNavClassName(item.url)}
                                            title={item.title}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
                        Organization
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projectItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="h-10">
                                        <NavLink
                                            to={item.url}
                                            className={getNavClassName(item.url)}
                                            title={item.title}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
                        Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {accountItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="h-10">
                                        <NavLink
                                            to={item.url}
                                            className={getNavClassName(item.url)}
                                            title={item.title}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}