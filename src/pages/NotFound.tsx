import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, FileText, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to Justice-Bot to continue your legal journey."
      />
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-muted-foreground mb-8">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track with your legal journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Button asChild variant="default" className="h-auto py-4">
                <a href="/" className="flex flex-col items-center gap-2">
                  <Home className="w-6 h-6" />
                  <span className="font-semibold">Go Home</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4">
                <a href="/triage" className="flex flex-col items-center gap-2">
                  <Search className="w-6 h-6" />
                  <span className="font-semibold">Start Triage</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4">
                <a href="/forms" className="flex flex-col items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold">Browse Forms</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4">
                <a href="/faq" className="flex flex-col items-center gap-2">
                  <HelpCircle className="w-6 h-6" />
                  <span className="font-semibold">Get Help</span>
                </a>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Popular destinations:</p>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <a href="/ltb-journey" className="hover:text-primary transition-colors">LTB Help</a>
                <span>•</span>
                <a href="/hrto-journey" className="hover:text-primary transition-colors">HRTO Help</a>
                <span>•</span>
                <a href="/small-claims-journey" className="hover:text-primary transition-colors">Small Claims</a>
                <span>•</span>
                <a href="/family-journey" className="hover:text-primary transition-colors">Family Law</a>
                <span>•</span>
                <a href="/contact" className="hover:text-primary transition-colors">Contact Us</a>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
