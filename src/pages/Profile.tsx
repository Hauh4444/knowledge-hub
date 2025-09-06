import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useStats } from "../hooks/useStats";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ArrowLeft, Edit, Save, X, BookOpen, Star, Trophy } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

const Profile = () => {
    const { user, profile } = useAuth();
    const { stats } = useStats();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        skills: [] as string[],
    });

    useEffect(() => {
        if (profile) {
            setEditForm({
                name: profile.name || '',
                bio: profile.bio || '',
                skills: profile.skills || [],
            });
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: editForm.name,
                    bio: editForm.bio,
                    skills: editForm.skills,
                })
                .eq('id', user?.id);

            if (error) throw error;

            setIsEditing(false);
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });

            window.location.reload();
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        if (profile) {
            setEditForm({
                name: profile.name || '',
                bio: profile.bio || '',
                skills: profile.skills || [],
            });
        }
        setIsEditing(false);
    };

    const addSkill = (skill: string) => {
        if (skill && !editForm.skills.includes(skill)) {
            setEditForm(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setEditForm(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

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
                                <h1 className="text-3xl font-bold">Profile</h1>
                                <p className="text-muted-foreground">
                                    Manage your profile and preferences
                                </p>
                            </div>
                        </div>

                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCancel}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20">
                                            <AvatarFallback className="bg-gradient-secondary text-2xl">
                                                {profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                        placeholder="Your full name"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <h2 className="text-2xl font-bold">{profile?.name}</h2>
                                                    <p className="text-sm text-muted-foreground">Member since {new Date(profile?.created_at || '').toLocaleDateString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        {isEditing ? (
                                            <Textarea
                                                id="bio"
                                                value={editForm.bio}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                                placeholder="Tell us about yourself..."
                                                rows={4}
                                            />
                                        ) : (
                                            <p className="text-sm text-muted-foreground leading-relaxed text-left">
                                                {profile?.bio || 'No bio added yet.'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Skills</Label>
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {editForm.skills.map((skill, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                                            onClick={() => removeSkill(skill)}
                                                        >
                                                            {skill} <X className="h-3 w-3 ml-1" />
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <Input
                                                    placeholder="Add a skill and press Enter"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addSkill(e.currentTarget.value);
                                                            e.currentTarget.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {profile?.skills?.length ? (
                                                    profile.skills.map((skill, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {skill}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5" />
                                        Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Resources</span>
                                        </div>
                                        <span className="font-semibold">{stats.resourcesCreated}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Total Views</span>
                                        </div>
                                        <span className="font-semibold">{stats.totalViews.toLocaleString()}</span>
                                    </div>


                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-4 w-4 text-primary" />
                                            <span className="text-sm">Collaboration Score</span>
                                        </div>
                                        <span className="font-semibold">{stats.collaborationScore}/5.0</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Member Since</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {profile?.created_at
                                            ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'N/A'
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;