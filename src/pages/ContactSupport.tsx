import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, MessageSquare, Mail, Phone, Clock } from "lucide-react";

const ContactSupport = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
        priority: "medium"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        toast({
            title: "Support Request Submitted",
            description: "We've received your request and will get back to you within 24 hours.",
        });

        setFormData({
            name: "",
            email: "",
            subject: "",
            category: "",
            message: "",
            priority: "medium"
        });
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/help-center">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-6 w-6" />
                                Contact Support
                            </h1>
                            <p className="text-muted-foreground">
                                Get help from our support team
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send us a message</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="account">Account Issues</SelectItem>
                                                        <SelectItem value="technical">Technical Support</SelectItem>
                                                        <SelectItem value="billing">Billing Questions</SelectItem>
                                                        <SelectItem value="feature">Feature Request</SelectItem>
                                                        <SelectItem value="bug">Bug Report</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="priority">Priority</Label>
                                                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                        <SelectItem value="urgent">Urgent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={(e) => handleInputChange('message', e.target.value)}
                                                placeholder="Please describe your issue or question in detail..."
                                                className="min-h-[120px]"
                                                required
                                            />
                                        </div>

                                        <Button type="submit" className="w-full">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Other Ways to Reach Us</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">support@example.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Phone className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Phone</p>
                                            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Clock className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Business Hours</p>
                                            <p className="text-sm text-muted-foreground">
                                                Mon-Fri: 9AM-6PM EST<br />
                                                Weekend: Limited support
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Response Times</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Urgent</span>
                                        <span className="text-sm font-medium">2-4 hours</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">High</span>
                                        <span className="text-sm font-medium">4-8 hours</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Medium</span>
                                        <span className="text-sm font-medium">1-2 days</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Low</span>
                                        <span className="text-sm font-medium">2-5 days</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Looking for quick answers?
                                    </p>
                                    <Link to="/help-center">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Browse Help Center
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactSupport;