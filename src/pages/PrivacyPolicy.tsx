import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Globe } from "lucide-react";

const PrivacyPolicy = () => {
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <div className="container px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link to="/settings">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Shield className="h-6 w-6" />
                                Privacy Policy
                            </h1>
                            <p className="text-muted-foreground">
                                Last updated: January 1, 2024
                            </p>
                        </div>
                    </div>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Table of Contents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-2">
                                <a href="#information-collection" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'information-collection')}>1. Information We Collect</a>
                                <a href="#information-use" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'information-use')}>2. How We Use Information</a>
                                <a href="#information-sharing" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'information-sharing')}>3. Information Sharing</a>
                                <a href="#data-security" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'data-security')}>4. Data Security</a>
                                <a href="#user-rights" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'user-rights')}>5. Your Rights</a>
                                <a href="#contact" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'contact')}>6. Contact Us</a>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground mb-4">
                                    At our platform, we are committed to protecting your privacy and ensuring the security of your personal information.
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                                </p>
                                <p className="text-muted-foreground">
                                    By using our service, you agree to the collection and use of information in accordance with this policy.
                                </p>
                            </CardContent>
                        </Card>

                        <Card id="information-collection">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    1. Information We Collect
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-left">
                                <div>
                                    <h4 className="font-semibold mb-2">Personal Information</h4>
                                    <p className="text-muted-foreground text-sm">
                                        We collect information you provide directly to us, such as when you create an account,
                                        update your profile, or contact us for support. This may include:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                                        <li>Name and email address</li>
                                        <li>Profile information (bio, skills, avatar)</li>
                                        <li>Account preferences and settings</li>
                                        <li>Communications with us</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Usage Information</h4>
                                    <p className="text-muted-foreground text-sm">
                                        We automatically collect certain information about your use of our service, including:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                                        <li>Log data (IP address, browser type, pages visited)</li>
                                        <li>Device information</li>
                                        <li>Usage patterns and preferences</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card id="information-use">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Database className="h-5 w-5" />
                                    2. How We Use Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    We use the information we collect to:
                                </p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                    <li>Provide, maintain, and improve our service</li>
                                    <li>Process transactions and send related information</li>
                                    <li>Send technical notices, updates, and security alerts</li>
                                    <li>Respond to your comments, questions, and customer service requests</li>
                                    <li>Communicate with you about products, services, and events</li>
                                    <li>Monitor and analyze trends, usage, and activities</li>
                                    <li>Detect, investigate, and prevent fraudulent transactions</li>
                                    <li>Personalize and improve user experience</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card id="information-sharing">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    3. Information Sharing
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-left">
                                <p className="text-muted-foreground text-sm">
                                    We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                                </p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                    <li>With your consent</li>
                                    <li>To comply with legal obligations</li>
                                    <li>To protect our rights and safety</li>
                                    <li>With service providers who assist us in operating our platform</li>
                                    <li>In connection with a merger, acquisition, or sale of assets</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card id="data-security">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    4. Data Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    We implement appropriate technical and organizational security measures to protect your personal information against
                                    unauthorized access, alteration, disclosure, or destruction. These measures include:
                                </p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                    <li>Encryption of data in transit and at rest</li>
                                    <li>Regular security assessments and updates</li>
                                    <li>Access controls and authentication measures</li>
                                    <li>Employee training on data protection</li>
                                    <li>Incident response procedures</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card id="user-rights">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <UserCheck className="h-5 w-5" />
                                    5. Your Rights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    You have the following rights regarding your personal information:
                                </p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                    <li><strong>Access:</strong> Request copies of your personal data</li>
                                    <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                                    <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                                    <li><strong>Portability:</strong> Request transfer of your data</li>
                                    <li><strong>Objection:</strong> Object to processing of your data</li>
                                    <li><strong>Restriction:</strong> Request restriction of processing</li>
                                </ul>
                                <p className="text-muted-foreground text-sm mt-4">
                                    To exercise these rights, please contact us using the contact information below.
                                </p>
                            </CardContent>
                        </Card>

                        <Card id="contact">
                            <CardHeader className="text-center">
                                <CardTitle>6. Contact Us</CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Email:</strong> privacy@example.com</p>
                                    <p><strong>Address:</strong> 123 Privacy Street, Data City, DC 12345</p>
                                </div>
                                <div className="mt-6 text-center">
                                    <Link to="/contact-support">
                                        <Button>Contact Support</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;