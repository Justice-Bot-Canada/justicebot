import Header from "@/components/Header";
import SimplifiedHero from "@/components/SimplifiedHero";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ClinicWelcomeBanner from "@/components/ClinicWelcomeBanner";
import { CountrySelector } from "@/components/CountrySelector";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analytics } from "@/utils/analytics";

/**
 * Index - Simplified Conversion-Optimized Landing
 * 
 * ONE promise: Upload doc → Get explanation → See next step
 * All advanced features come AFTER signup
 * 
 * Per conversion brief:
 * - No mention of merit engines, AI architecture, multiple jurisdictions
 * - Single CTA: Start with document upload
 * - Free: account, upload, explanation
 * - First paywall: Generate actual legal form ($5.99)
 */
const Index = () => {
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
    "image": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Justice-Bot | Understand Your Legal Documents"
        description="Upload your legal document. We explain it in plain language and tell you the next step. Free to start. 2,000+ Canadians helped."
        keywords="legal document help Canada, explain legal documents, legal forms Canada, tenant rights Ontario, HRTO complaint, LTB forms"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
      />
      <LocalBusinessSchema />
      <ClinicWelcomeBanner />
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
                <h3 className="font-medium text-sm">Your data is encrypted</h3>
                <p className="text-xs text-muted-foreground">Enterprise-grade security</p>
              </Card>
              <Card className="p-4 bg-background">
                <div className="text-2xl mb-2">🇨🇦</div>
                <h3 className="font-medium text-sm">Canadian data storage</h3>
                <p className="text-xs text-muted-foreground">PIPEDA compliant</p>
              </Card>
              <Card className="p-4 bg-background">
                <div className="text-2xl mb-2">⚖️</div>
                <h3 className="font-medium text-sm">Not legal advice</h3>
                <p className="text-xs text-muted-foreground">Information tool only</p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works - Ultra Simple */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload Your Document</h3>
                <p className="text-sm text-muted-foreground">
                  Any legal notice, form, or letter you've received
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Get Plain Language</h3>
                <p className="text-sm text-muted-foreground">
                  We explain what it means and what you need to do
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">See Your Options</h3>
                <p className="text-sm text-muted-foreground">
                  Get the forms you need and your recommended next steps
                </p>
              </div>
            </div>
            
            {/* Secondary CTA - same destination as hero */}
            <div className="text-center mt-8">
              <Button 
                size="lg" 
                onClick={() => navigate('/upload')}
                className="px-8"
              >
                Start Free Now
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                No credit card required • Results in minutes
              </p>
            </div>
          </div>
        </section>

        {/* Simple FAQ */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-center mb-8">Common Questions</h2>
            <div className="space-y-6">
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Is it really free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes. Upload your document, get the explanation, and see your next steps — completely free. 
                  You only pay ($5.99) when you're ready to generate your actual court forms.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground text-sm">
                  No. Start immediately without signing up. Create an account later only if you want to save your progress.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-semibold mb-2">What types of documents can I upload?</h3>
                <p className="text-muted-foreground text-sm">
                  Eviction notices, tribunal forms, legal letters, contracts, court documents — 
                  anything related to housing, human rights, employment, or civil disputes in Canada.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Is this legal advice?</h3>
                <p className="text-muted-foreground text-sm">
                  No. We explain what your documents mean and guide you through the process, but we're not lawyers. 
                  For legal advice specific to your situation, consult a qualified lawyer.
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

export default Index;
