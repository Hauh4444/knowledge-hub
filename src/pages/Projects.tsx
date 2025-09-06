import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { ArrowLeft, Plus, Users, Calendar as CalendarIcon, CheckSquare } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "../lib/utils";

const Projects = () => {
    const { projects, loading, createProject } = useProjects();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);

    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        status: "active",
        deadline: null as Date | null
    });

    const handleCreateProject = async () => {
        if (!newProject.name.trim()) {
            toast({
                title: "Almost there!",
                description: "Your project needs a name to get started",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsCreating(true);
            await createProject({
                name: newProject.name,
                description: newProject.description,
                status: newProject.status,
                deadline: newProject.deadline?.toISOString() || null
            });
            setNewProject({ name: "", description: "", status: "active", deadline: null });
            toast({
                title: "All done!",
                description: "Your project has been created successfully",
            });
        } catch (error) {
            toast({
                title: "Oops! Something went wrong",
                description: "We couldn't create your project right now. Please try again in a moment.",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
        }
    };


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200';
            case 'on_hold':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200';
            default:
                return 'bg-muted text-muted-foreground dark:bg-muted/50';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-2">
                                    <CheckSquare className="h-6 w-6" />
                                    Projects
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your projects and collaborate with your team
                                </p>
                            </div>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Project</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Project Name</label>
                                        <Input
                                            value={newProject.name}
                                            onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter project name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea
                                            value={newProject.description}
                                            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Describe your project"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <Select value={newProject.status} onValueChange={(value) => setNewProject(prev => ({ ...prev, status: value }))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="on_hold">On Hold</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Deadline (Optional)</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !newProject.deadline && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {newProject.deadline ? format(newProject.deadline, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={newProject.deadline || undefined}
                                                    onSelect={(date) => setNewProject(prev => ({ ...prev, deadline: date || null }))}
                                                    initialFocus
                                                    className="p-3 pointer-events-auto"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setNewProject({ name: "", description: "", status: "active", deadline: null })}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleCreateProject} disabled={isCreating}>
                                            {isCreating ? "Creating..." : "Create Project"}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-muted-foreground">Loading projects...</div>
                        </div>
                    ) : projects.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="text-center py-16">
                                <CheckSquare className="h-16 w-16 mx-auto mb-6 text-muted-foreground/60" />
                                <h3 className="text-xl font-semibold mb-3">Let's get your first project started!</h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    Projects help you organize your work and collaborate with others.
                                    Create your first one and start building something amazing together.
                                </p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Your First Project
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New Project</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium">Project Name</label>
                                                <Input
                                                    value={newProject.name}
                                                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Enter project name"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Description</label>
                                                <Textarea
                                                    value={newProject.description}
                                                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                                    placeholder="Describe your project"
                                                    rows={3}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Status</label>
                                                <Select value={newProject.status} onValueChange={(value) => setNewProject(prev => ({ ...prev, status: value }))}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Deadline (Optional)</label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !newProject.deadline && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {newProject.deadline ? format(newProject.deadline, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={newProject.deadline || undefined}
                                                            onSelect={(date) => setNewProject(prev => ({ ...prev, deadline: date || null }))}
                                                            initialFocus
                                                            className="p-3 pointer-events-auto"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setNewProject({ name: "", description: "", status: "active", deadline: null })}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleCreateProject} disabled={isCreating}>
                                                    {isCreating ? "Creating..." : "Create Project"}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-0 shadow-sm cursor-pointer"
                                    onClick={() => navigate(`/project/${project.id}`)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {project.description || 'No description provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        {project.deadline && (
                                            <div className="mb-3 text-sm text-muted-foreground">
                                                <CalendarIcon className="inline h-3 w-3 mr-1" />
                                                Due: {format(new Date(project.deadline), "PPP")}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                                                {project.status.replace('_', ' ')}
                                            </Badge>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    <span>{project.members?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Projects;