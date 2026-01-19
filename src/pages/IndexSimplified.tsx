import Header from "@/components/Header";
import SimplifiedHero from "@/components/SimplifiedHero";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { CountrySelector } from "@/components/CountrySelector";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { analytics } from "@/utils/analytics";

/**
 * IndexSimplified - Conversion-optimized landing page
 * 
 * ONE promise: Upload doc, get explanation, see next step
 * All advanced features come AFTER signup
 */
const IndexSimplified = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Track landing view
  useEffect(() => {
    if (!loading && !user) {
      analytics.landingView();
    }
  }, [loading, user]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Justice-Bot",
    "applicationCategory": "Legal",
    "operatingSystem": "Web",
    "description": "Upload your legal document. We explain it in plain language and tell you the next step.",
    "url": "https://www.justice-bot.com",
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Justice-Bot | Understand Your Legal Documents"
        description="Upload your legal document. We explain it in plain language and tell you the next step. Free to start."
        keywords="legal document help Canada, explain legal documents, legal forms Canada"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
      />
      <LocalBusinessSchema />
      <Header />
      
      <main id="main-content" tabIndex={-1}>
        {/* Simplified Hero - Single Promise */}
        <SimplifiedHero />
        
        {/* Minimal Trust Block */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
              <Card className="p-4 bg-background">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-sm text-muted-foreground">Your data is encrypted</p>
              </Card>
              <Card className="p-4 bg-background">
                <div className="text-2xl mb-2">🇨🇦</div>
                <p className="text-sm text-muted-foreground">Canadian data storage</p>
              </Card>
              <Card className="p-4 bg-background">
                <div className="text-2xl mb-2">⚖️</div>
                <p className="text-sm text-muted-foreground">Not legal advice</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Simple FAQ - Just essentials */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-center mb-8">Common Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Is it really free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes. Upload your document, get the explanation, and see your next steps — completely free. 
                  You only pay when you're ready to generate your actual court forms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground text-sm">
                  No. Start immediately without signing up. Create an account later if you want to save your progress.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is this legal advice?</h3>
                <p className="text-muted-foreground text-sm">
                  No. We explain what your documents mean and guide you through the process, but we're not lawyers. 
                  For legal advice, consult a qualified lawyer.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <CountrySelector />
    </div>
  );
};

export default IndexSimplified;
