import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft, FileText, Scale, AlertTriangle, Shield, UserX, Gavel } from "lucide-react";

const TermsOfService = () => {
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
                                <FileText className="h-6 w-6" />
                                Terms of Service
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
                                <a href="#acceptance" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'acceptance')}>1. Acceptance of Terms</a>
                                <a href="#service-description" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'service-description')}>2. Service Description</a>
                                <a href="#user-accounts" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'user-accounts')}>3. User Accounts</a>
                                <a href="#acceptable-use" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'acceptable-use')}>4. Acceptable Use</a>
                                <a href="#intellectual-property" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'intellectual-property')}>5. Intellectual Property</a>
                                <a href="#privacy" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'privacy')}>6. Privacy</a>
                                <a href="#termination" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'termination')}>7. Termination</a>
                                <a href="#disclaimers" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'disclaimers')}>8. Disclaimers</a>
                                <a href="#limitation-liability" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'limitation-liability')}>9. Limitation of Liability</a>
                                <a href="#governing-law" className="text-sm text-primary hover:underline" onClick={(e) => scrollToSection(e, 'governing-law')}>10. Governing Law</a>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        <Card id="acceptance">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Scale className="h-5 w-5" />
                                    1. Acceptance of Terms
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm">
                                    By accessing and using our service, you accept and agree to be bound by the terms and provision of this agreement.
                                    If you do not agree to abide by the above, please do not use this service.
                                </p>
                            </CardContent>
                        </Card>

                        <Card id="service-description">
                            <CardHeader className="text-center">
                                <CardTitle>2. Service Description</CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    Our platform provides a collaborative space for users to share resources, manage projects, and connect with other professionals.
                                    The service includes but is not limited to:
                                </p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>Resource creation and sharing</li>
                                    <li>Project management tools</li>
                                    <li>Collaboration features</li>
                                    <li>User profiles and networking</li>
                                    <li>Notification system</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card id="user-accounts">
                            <CardHeader className="text-center">
                                <CardTitle>3. User Accounts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-left">
                                <div>
                                    <h4 className="font-semibold mb-2">Account Creation</h4>
                                    <p className="text-muted-foreground text-sm">
                                        To use certain features of our service, you must create an account. You agree to provide accurate,
                                        current, and complete information during the registration process.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Account Security</h4>
                                    <p className="text-muted-foreground text-sm">
                                        You are responsible for safeguarding your account credentials and for all activities that occur under your account.
                                        You must notify us immediately of any unauthorized use of your account.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card id="acceptable-use">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    4. Acceptable Use
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    You agree not to use the service for any of the following prohibited activities:
                                </p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                                    <li>Violating any applicable laws or regulations</li>
                                    <li>Infringing on intellectual property rights</li>
                                    <li>Transmitting harmful or malicious content</li>
                                    <li>Harassing, threatening, or abusing other users</li>
                                    <li>Spamming or sending unsolicited communications</li>
                                    <li>Attempting to gain unauthorized access to our systems</li>
                                    <li>Interfering with the proper functioning of the service</li>
                                    <li>Impersonating others or providing false information</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card id="intellectual-property">
                            <CardHeader className="text-center">
                                <CardTitle>5. Intellectual Property</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-left">
                                <div>
                                    <h4 className="font-semibold mb-2">Our Content</h4>
                                    <p className="text-muted-foreground text-sm">
                                        The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">User Content</h4>
                                    <p className="text-muted-foreground text-sm">
                                        You retain ownership of content you post on our platform. By posting content, you grant us a non-exclusive,
                                        worldwide, royalty-free license to use, modify, and display your content in connection with the service.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card id="privacy">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    6. Privacy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm">
                                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service,
                                    to understand our practices.
                                </p>
                                <div className="mt-4 text-center">
                                    <Link to="/privacy-policy">
                                        <Button variant="outline" size="sm">View Privacy Policy</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <Card id="termination">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <UserX className="h-5 w-5" />
                                    7. Termination
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability,
                                    under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
                                </p>
                            </CardContent>
                        </Card>

                        <Card id="disclaimers">
                            <CardHeader className="text-center">
                                <CardTitle>8. Disclaimers</CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm">
                                    The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind,
                                    express or implied, regarding the use or the results of this service in terms of its correctness, accuracy, reliability,
                                    or otherwise.
                                </p>
                            </CardContent>
                        </Card>

                        <Card id="limitation-liability">
                            <CardHeader className="text-center">
                                <CardTitle>9. Limitation of Liability</CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm">
                                    In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates,
                                    be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation,
                                    loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                                </p>
                            </CardContent>
                        </Card>

                        <Card id="governing-law">
                            <CardHeader className="text-center">
                                <CardTitle className="flex items-center justify-center gap-2">
                                    <Gavel className="h-5 w-5" />
                                    10. Governing Law
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm">
                                    These Terms shall be interpreted and governed by the laws of the State of [Your State/Country],
                                    without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the
                                    exclusive jurisdiction of the courts located in [Your Jurisdiction].
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>Questions About These Terms?</CardTitle>
                            </CardHeader>
                            <CardContent className="text-left">
                                <p className="text-muted-foreground text-sm mb-4">
                                    If you have any questions about these Terms of Service, please contact us.
                                </p>
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

export default TermsOfService;