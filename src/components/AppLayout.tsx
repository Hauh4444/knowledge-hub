import { useAuth } from "../hooks/useAuth";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const { user } = useAuth();

    if (!user) {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}