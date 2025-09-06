import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Bell, Check, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";

interface Notification {
    id: string;
    type: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load notifications",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to mark notification as read",
                variant: "destructive",
            });
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;

            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            toast({
                title: "Success",
                description: "Notification deleted",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to delete notification",
                variant: "destructive",
            });
        }
    };

    const markAllAsRead = async () => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user?.id)
                .eq('is_read', false);

            if (error) throw error;

            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            toast({
                title: "Success",
                description: "All notifications marked as read",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to mark all as read",
                variant: "destructive",
            });
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-2">
                                    <Bell className="h-6 w-6" />
                                    Notifications
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your notifications and stay updated
                                </p>
                            </div>
                        </div>

                        {unreadCount > 0 && (
                            <Button onClick={markAllAsRead}>
                                <Check className="h-4 w-4 mr-2" />
                                Mark All Read ({unreadCount})
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                                <p className="text-muted-foreground">
                                    You're all caught up! New notifications will appear here.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`transition-all duration-200 ${
                                        !notification.is_read
                                            ? 'border-primary/50 bg-primary/5'
                                            : 'hover:shadow-md'
                                    }`}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge
                                                        variant={notification.type === 'like' ? 'default' :
                                                            notification.type === 'comment' ? 'secondary' : 'outline'}
                                                        className="text-xs"
                                                    >
                                                        {notification.type}
                                                    </Badge>
                                                    {!notification.is_read && (
                                                        <div className="h-2 w-2 bg-primary rounded-full" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    {new Date(notification.created_at).toLocaleDateString()} at{' '}
                                                    {new Date(notification.created_at).toLocaleTimeString()}
                                                </p>
                                                <p className="text-sm leading-relaxed">
                                                    {notification.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!notification.is_read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => markAsRead(notification.id)}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteNotification(notification.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;