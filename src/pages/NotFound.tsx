import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
    useEffect(() => {
        console.warn("User visited a page that doesn't exist");
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
            <div className="text-center">
                <div className="text-center py-16">
                    <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
                    <h2 className="text-2xl font-semibold mb-3">Oops! Page not found</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        It looks like the page you're looking for doesn't exist or has been moved.
                        Let's get you back on track!
                    </p>
                    <div className="space-x-4">
                        <Link to="/dashboard">
                            <Button className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300">
                                Back to Dashboard
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="outline">
                                Go Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
