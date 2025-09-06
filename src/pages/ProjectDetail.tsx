import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { ArrowLeft, Plus, CheckSquare, Clock, User, Edit, Trash, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "../lib/utils";

interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    deadline: string | null;
    owner_id: string;
    members: string[];
    created_at: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    assignee_id: string | null;
    due_date: string | null;
    created_at: string;
    profiles?: {
        name: string;
    };
}

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        status: "todo",
        due_date: ""
    });
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProject();
            fetchTasks();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProject(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load project",
                variant: "destructive",
            });
            navigate('/projects');
        }
    };

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('project_tasks')
                .select(`
                    *,
                    profiles:assignee_id (
                        name
                    )
                `)
                .eq('project_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async () => {
        if (!newTask.title.trim()) {
            toast({
                title: "Task needs a title!",
                description: "Please give your task a descriptive title",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsCreatingTask(true);
            const { error } = await supabase
                .from('project_tasks')
                .insert([{
                    project_id: id,
                    title: newTask.title,
                    description: newTask.description,
                    status: newTask.status,
                    assignee_id: user?.id,
                    due_date: newTask.due_date || null
                }]);

            if (error) throw error;

            setNewTask({ title: "", description: "", status: "todo", due_date: "" });
            fetchTasks();
            toast({
                title: "Nice work!",
                description: "Your task has been created successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create task",
                variant: "destructive",
            });
        } finally {
            setIsCreatingTask(false);
        }
    };

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('project_tasks')
                .update({ status: newStatus })
                .eq('id', taskId);

            if (error) throw error;
            fetchTasks();
            toast({
                title: "Perfect!",
                description: "Task status updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update task",
                variant: "destructive",
            });
        }
    };

    const updateProject = async () => {
        if (!editingProject?.name?.trim()) {
            toast({
                title: "Project needs a name!",
                description: "Please give your project a descriptive name",
                variant: "destructive",
            });
            return;
        }

        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    name: editingProject.name,
                    description: editingProject.description,
                    status: editingProject.status,
                    deadline: editingProject.deadline
                })
                .eq('id', id);

            if (error) throw error;

            setEditingProject(null);
            fetchProject();
            toast({
                title: "Success",
                description: "Project updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update project",
                variant: "destructive",
            });
        }
    };

    const deleteProject = async () => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Project deleted successfully",
            });
            navigate('/projects');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete project",
                variant: "destructive",
            });
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            const { error } = await supabase
                .from('project_tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
            fetchTasks();
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete task",
                variant: "destructive",
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'todo':
                return 'bg-muted text-muted-foreground dark:bg-muted/50';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200';
            case 'done':
                return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-200';
            default:
                return 'bg-muted text-muted-foreground dark:bg-muted/50';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="flex justify-center items-center py-12">
                        <div className="text-muted-foreground">Loading project...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-gradient-subtle">
                <div className="container px-4 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
                        <Link to="/projects">
                            <Button>Back to Projects</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/projects">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">{project.name}</h1>
                                <p className="text-muted-foreground">
                                    {project.description || 'No description provided'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProject(project)}
                                className="flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Project
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={deleteProject}
                                className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <Trash className="h-4 w-4" />
                                Delete
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Task
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create New Task</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">Task Title</label>
                                            <Input
                                                value={newTask.title}
                                                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Enter task title"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Description</label>
                                            <Textarea
                                                value={newTask.description}
                                                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Describe the task"
                                                rows={3}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Status</label>
                                            <Select value={newTask.status} onValueChange={(value) => setNewTask(prev => ({ ...prev, status: value }))}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="todo">To Do</SelectItem>
                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                    <SelectItem value="done">Done</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Due Date (Optional)</label>
                                            <Input
                                                type="date"
                                                value={newTask.due_date}
                                                onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setNewTask({ title: "", description: "", status: "todo", due_date: "" })}>
                                                Cancel
                                            </Button>
                                            <Button onClick={createTask} disabled={isCreatingTask}>
                                                {isCreatingTask ? "Creating..." : "Create Task"}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Status</span>
                                </div>
                                <Badge className={`mt-1 ${getStatusColor(project.status)}`}>
                                    {project.status.replace('_', ' ')}
                                </Badge>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Created</span>
                                </div>
                                <p className="font-medium mt-1">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>

                        {project.deadline && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Deadline</span>
                                    </div>
                                    <p className="font-medium mt-1">
                                        {format(new Date(project.deadline), "PPP")}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Tasks</span>
                                </div>
                                <p className="font-medium mt-1">
                                    {tasks.length} total
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Members</span>
                                </div>
                                <p className="font-medium mt-1">
                                    {project.members?.length || 0} members
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {editingProject && (
                        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
                            <DialogContent className="pointer-events-auto">
                                <DialogHeader>
                                    <DialogTitle>Edit Project</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Project Name</label>
                                        <Input
                                            value={editingProject.name}
                                            onChange={(e) => setEditingProject(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                                            placeholder="Enter project name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Description</label>
                                        <Textarea
                                            value={editingProject.description}
                                            onChange={(e) => setEditingProject(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                                            placeholder="Describe your project"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <Select
                                            value={editingProject.status}
                                            onValueChange={(value) => setEditingProject(prev => prev ? ({ ...prev, status: value }) : null)}
                                        >
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
                                                        !editingProject.deadline && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {editingProject.deadline ? format(new Date(editingProject.deadline), "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={editingProject.deadline ? new Date(editingProject.deadline) : undefined}
                                                    onSelect={(date) => setEditingProject(prev => prev ? ({ ...prev, deadline: date ? date.toISOString() : null }) : null)}
                                                    initialFocus
                                                    className="p-3 pointer-events-auto"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setEditingProject(null)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={updateProject}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tasks.length === 0 ? (
                                <div className="text-center py-16">
                                    <CheckSquare className="h-16 w-16 mx-auto mb-6 text-muted-foreground/60" />
                                    <h3 className="text-xl font-semibold mb-3">Time to add some tasks!</h3>
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        Break down your project into manageable tasks. This helps keep everyone
                                        on track and makes progress visible.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tasks.map((task) => (
                                        <Card key={task.id} className="border">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="font-medium">{task.title}</h4>
                                                            <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                                                                <SelectTrigger className="w-auto">
                                                                    <Badge className={getStatusColor(task.status)}>
                                                                        {task.status.replace('_', ' ')}
                                                                    </Badge>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="todo">To Do</SelectItem>
                                                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                                                    <SelectItem value="done">Done</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {task.description && (
                                                            <p className="text-sm text-muted-foreground mb-3">
                                                                {task.description}
                                                            </p>
                                                        )}

                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            {task.profiles && (
                                                                <div className="flex items-center gap-1">
                                                                    <User className="h-3 w-3" />
                                                                    <span>{task.profiles.name}</span>
                                                                </div>
                                                            )}
                                                            {task.due_date && (
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1">
                                                                <CalendarIcon className="h-3 w-3" />
                                                                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => deleteTask(task.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;