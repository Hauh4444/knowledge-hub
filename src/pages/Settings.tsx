import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "../hooks/useAuth";
import { useUserSettings } from "../hooks/useUserSettings";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, Settings as SettingsIcon, Bell, Shield, Palette, Globe } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";

const Settings = () => {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const { settings, loading: settingsLoading, updateSetting } = useUserSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSettingChange = async (key: string, value: boolean) => {
        try {
            await updateSetting(key as any, value);
            toast({
                title: "Setting Updated",
                description: "Your preferences have been saved successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save setting. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleThemeChange = (isDark: boolean) => {
        setTheme(isDark ? 'dark' : 'light');
        toast({
            title: "Theme Changed",
            description: `Switched to ${isDark ? 'dark' : 'light'} mode`,
        });
    };

    if (!mounted || settingsLoading) {
        return (
            <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (!error) {
            toast({
                title: "Signed Out",
                description: "You have been signed out successfully",
            });
        }
    };

    const deleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, including resources, projects, and profile information."
        );

        if (!confirmed) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast({
                    title: "Error",
                    description: "You must be logged in to delete your account",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase.functions.invoke('delete-account', {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });

            if (error) {
                console.error('Account deletion error:', error);
                toast({
                    title: "Error",
                    description: "Failed to delete account. Please contact support.",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Account Deleted",
                description: "Your account and all associated data have been permanently deleted.",
            });

        } catch (error) {
            console.error('Unexpected error during account deletion:', error);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again or contact support.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <SettingsIcon className="h-6 w-6" />
                                Settings
                            </h1>
                            <p className="text-muted-foreground">
                                Manage your account preferences and privacy settings
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 flex-1">
                                            <Label>Push Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive push notifications in your browser
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.pushNotifications}
                                            onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 flex-1">
                                            <Label>Weekly Digest</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Get a weekly summary of your activity
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.weeklyDigest}
                                            onCheckedChange={(value) => handleSettingChange('weeklyDigest', value)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 flex-1">
                                            <Label>Collaboration Alerts</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified about project updates and mentions
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.collaborationAlerts}
                                            onCheckedChange={(value) => handleSettingChange('collaborationAlerts', value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Privacy
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 flex-1">
                                            <Label>Public Profile</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Make your profile visible to other users
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.publicProfile}
                                            onCheckedChange={(value) => handleSettingChange('publicProfile', value)}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 flex-1">
                                            <Label>Analytics Tracking</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Help us improve by sharing usage analytics
                                            </p>
                                        </div>
                                        <Switch
                                            checked={settings.analyticsTracking}
                                            onCheckedChange={(value) => handleSettingChange('analyticsTracking', value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5" />
                                        Appearance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5 flex-1">
                                            <Label>Dark Mode</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Switch between light and dark themes
                                            </p>
                                        </div>
                                        <Switch
                                            checked={theme === 'dark'}
                                            onCheckedChange={handleThemeChange}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm">
                                        <p className="font-medium">User ID</p>
                                        <p className="text-muted-foreground">{user?.id}</p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Button variant="outline" className="w-full" onClick={handleSignOut}>
                                            Sign Out
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={deleteAccount}
                                        >
                                            Delete Account
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5" />
                                        Support
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => window.open('/help-center', '_self')}
                                    >
                                        Help Center
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => window.open('/contact-support', '_self')}
                                    >
                                        Contact Support
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => window.open('/privacy-policy', '_self')}
                                    >
                                        Privacy Policy
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => window.open('/terms-of-service', '_self')}
                                    >
                                        Terms of Service
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;