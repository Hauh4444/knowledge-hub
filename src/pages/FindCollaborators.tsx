import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../integrations/supabase/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ArrowLeft, Search, Users, MessageSquare, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useConnections } from "../hooks/useConnections";
import { useConversations } from "../hooks/useConversations";

interface Collaborator {
    id: string;
    name: string;
    bio?: string;
    skills: string[];
    created_at: string;
}

const FindCollaborators = () => {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const { sendConnectionRequest, getConnectionStatus } = useConnections();
    const { createOrGetConversation } = useConversations();

    useEffect(() => {
        if (user) {
            fetchCollaborators();
        }
    }, [searchTerm, selectedSkill, user]);

    const fetchCollaborators = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase.rpc('get_public_profiles_list');
            if (error) throw error;

            let filteredData = (data || []).filter(profile => profile.id !== user.id);

            const { data: connections } = await supabase
                .from('connections')
                .select('requester_id, addressee_id, status')
                .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
                .eq('status', 'accepted');

            if (connections && connections.length > 0) {
                const connectedUserIds = connections.map(conn =>
                    conn.requester_id === user.id ? conn.addressee_id : conn.requester_id
                );
                filteredData = filteredData.filter(profile =>
                    !connectedUserIds.includes(profile.id)
                );
            }

            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                filteredData = filteredData.filter(profile =>
                    profile.name?.toLowerCase().includes(search) ||
                    profile.bio?.toLowerCase().includes(search)
                );
            }

            if (selectedSkill) {
                filteredData = filteredData.filter(profile =>
                    profile.skills?.includes(selectedSkill)
                );
            }

            setCollaborators(filteredData.slice(0, 20));
        } catch (error: any) {
            toast.error("Failed to load collaborators");
        } finally {
            setLoading(false);
        }
    };

    const sendCollaborationRequest = async (collaboratorId: string, collaboratorName: string) => {
        try {
            await sendConnectionRequest(collaboratorId);
            toast.success(`Connection request sent to ${collaboratorName}!`);
        } catch (error: any) {
            toast.error(error.message || "Failed to send connection request");
        }
    };

    const startConversation = async (collaboratorId: string, collaboratorName: string) => {
        try {
            const conversationId = await createOrGetConversation(collaboratorId);
            navigate(`/messages/${conversationId}`);
            toast.success(`Started conversation with ${collaboratorName}!`);
        } catch (error: any) {
            toast.error(error.message || "Failed to start conversation");
        }
    };

    const allSkills = Array.from(
        new Set(collaborators.flatMap(c => c.skills || []))
    ).sort();

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Users className="h-6 w-6" />
                                Find Collaborators
                            </h1>
                            <p className="text-muted-foreground">
                                Connect with professionals who share your interests
                            </p>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="py-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name or bio..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={selectedSkill === "" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedSkill("")}
                                    >
                                        All Skills
                                    </Button>
                                    {allSkills.slice(0, 6).map((skill) => (
                                        <Button
                                            key={skill}
                                            variant={selectedSkill === skill ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedSkill(skill)}
                                        >
                                            {skill}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Finding collaborators...</p>
                        </div>
                    ) : collaborators.length === 0 ? (
                        <Card className="w-fit mx-auto">
                            <CardContent className="text-center py-12 px-8">
                                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No collaborators found</h3>
                                <p className="text-muted-foreground text-sm">
                                    Try adjusting your search criteria or check back later for new members
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collaborators.map((collaborator) => (
                                <Card
                                    key={collaborator.id}
                                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border border-border/50 hover:border-border shadow-sm cursor-pointer h-full flex flex-col"
                                    onClick={() => navigate(`/user/${collaborator.id}`)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                    {collaborator.name}
                                                </h3>
                                                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                                                    {collaborator.bio || 'Professional looking to collaborate on exciting projects'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-3 flex-1">
                                        <div className="flex flex-wrap gap-2 mb-3 min-h-[1.5rem] overflow-hidden">
                                            {collaborator.skills && collaborator.skills.length > 0 ? (
                                                <>
                                                    {collaborator.skills.slice(0, 2).map((skill, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs hover:bg-accent transition-colors cursor-pointer bg-secondary/50 hover:bg-secondary/70 max-w-[120px] truncate"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {collaborator.skills.length > 2 && (
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            +{collaborator.skills.length - 2}
                                                        </Badge>
                                                    )}
                                                </>
                                            ) : (
                                                <Badge variant="outline" className="text-xs">
                                                    No skills listed
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-3 mt-auto border-t bg-muted/20 dark:bg-muted/10">
                                        <div className="flex flex-col gap-3 w-full">
                                            <div className="flex items-center w-full min-h-[1.5rem]">
                                                <Avatar className="h-6 w-6 shrink-0 border border-border/20">
                                                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                        {collaborator.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-muted-foreground flex-1 text-center px-2 truncate">
                                                    {new Date(collaborator.created_at).toLocaleDateString()}
                                                </span>
                                                <div className="flex items-center gap-1 text-xs shrink-0 text-muted-foreground">
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 justify-center">
                                                <Button
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        sendCollaborationRequest(collaborator.id, collaborator.name);
                                                    }}
                                                >
                                                    <UserPlus className="h-3 w-3 mr-1" />
                                                    Connect
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startConversation(collaborator.id, collaborator.name);
                                                    }}
                                                >
                                                    <MessageSquare className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Collaboration Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Look for collaborators with complementary skills</p>
                            <p>• Check their collaboration score and recent contributions</p>
                            <p>• Send a personalized connection request</p>
                            <p>• Be clear about your collaboration goals</p>
                            <p>• Start with smaller projects to build trust</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FindCollaborators;