import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "./hooks/useAuth";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AppLayout } from "./components/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Bookmarks from "./pages/Bookmarks";
import CreateResource from "./pages/CreateResource";
import ResourceDetail from "./pages/ResourceDetail";
import FindCollaborators from "./pages/FindCollaborators";
import Activity from "./pages/Activity";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import HelpCenter from "./pages/HelpCenter";
import HelpArticle from "./pages/HelpArticle";
import ContactSupport from "./pages/ContactSupport";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/PublicProfile";
import Messages from "./pages/Messages";
import Collaborators from "./pages/Collaborators";
import ManageResources from "./pages/ManageResources";
import "./App.css";

const queryClient = new QueryClient();

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <AppLayout>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                    path="/dashboard"
                    element={user ? <Dashboard /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/notifications"
                    element={user ? <Notifications /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/profile"
                    element={user ? <Profile /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/settings"
                    element={user ? <Settings /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/bookmarks"
                    element={user ? <Bookmarks /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/manage-resources"
                    element={user ? <ManageResources /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/create-resource"
                    element={user ? <CreateResource /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/resource/:id"
                    element={user ? <ResourceDetail /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/find-collaborators"
                    element={user ? <FindCollaborators /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/activity"
                    element={user ? <Activity /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/projects"
                    element={user ? <Projects /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/project/:id"
                    element={user ? <ProjectDetail /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/collaborators"
                    element={user ? <Collaborators /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/messages"
                    element={user ? <Messages /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/messages/:conversationId"
                    element={user ? <Messages /> : <Navigate to="/auth" />}
                />
                <Route
                    path="/user/:id"
                    element={user ? <PublicProfile /> : <Navigate to="/auth" />}
                />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/help/:slug" element={<HelpArticle />} />
                <Route path="/contact-support" element={<ContactSupport />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AppLayout>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AppContent />
                <Sonner />
            </Router>
        </QueryClientProvider>
    );
}

export default App;