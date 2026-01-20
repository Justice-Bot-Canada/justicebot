import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ClinicWelcomeBanner from "@/components/ClinicWelcomeBanner";
import ConversationalOnboarding from "@/components/ConversationalOnboarding";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analytics } from "@/utils/analytics";
import { Shield, MapPin, FileText, ArrowRight } from "lucide-react";

/**
 * Index - Conversational Onboarding Landing
 * 
 * NEW APPROACH per requirements:
 * - No country gate (Canada only assumed)
 * - Conversational flow with 2-3 questions
 * - Show value preview BEFORE signup
 * - Calm, reassuring, non-legalistic tone
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
    "description": "Free legal information tool. Answer a few questions and see what forms and processes may apply to your situation in Canada.",
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
        title="Justice-Bot | Free Legal Information for Canadians"
        description="Answer a few questions to see what legal forms and processes may apply to your situation. Free to start. No legal advice — just helpful information."
        keywords="legal help Canada, legal forms Canada, tenant rights Ontario, HRTO complaint, LTB forms, small claims court"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
      />
      <LocalBusinessSchema />
      <ClinicWelcomeBanner />
      <Header />
      
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section with Conversational Onboarding */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            {/* Intro Text */}
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Not sure where to start with your legal issue?
              </h1>
              <p className="text-lg text-muted-foreground">
                Answer a few quick questions. We'll show you what forms and processes may apply — no signup required to see your options.
              </p>
            </div>

            {/* Conversational Onboarding */}
            <ConversationalOnboarding />
          </div>
        </section>

        {/* Trust Signals - Minimal */}
        <section className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
              <Card className="p-4 bg-background border">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">Your data is encrypted</h3>
                <p className="text-xs text-muted-foreground">Enterprise-grade security</p>
              </Card>
              <Card className="p-4 bg-background border">
                <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">Canadian data storage</h3>
                <p className="text-xs text-muted-foreground">PIPEDA compliant</p>
              </Card>
              <Card className="p-4 bg-background border">
                <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-sm">Information only</h3>
                <p className="text-xs text-muted-foreground">Not legal advice</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Alternative Entry Points */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">Other Ways to Get Started</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/upload')}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Upload a Document
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Have a legal notice, form, or letter? Upload it and we'll explain what it means.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Start with document
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
              <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/find-my-path')}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Browse Legal Pathways
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Know your issue type? Explore the step-by-step process for different tribunals.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Explore pathways
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Simple FAQ */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-center mb-8">Common Questions</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Is this free?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes. See your options, understand your situation, and learn what forms may apply — completely free. 
                  You only pay when you're ready to generate filled court forms.
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground text-sm">
                  No. Start immediately without signing up. Create an account later only if you want to save your progress and access more detailed guidance.
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Is this legal advice?</h3>
                <p className="text-muted-foreground text-sm">
                  No. Justice-Bot provides legal information and helps you understand processes and forms. 
                  For advice specific to your situation, consult a qualified lawyer or community legal clinic.
                </p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">What areas of law does this cover?</h3>
                <p className="text-muted-foreground text-sm">
                  Housing and tenant issues, human rights complaints, employment disputes, family law, small claims, 
                  and more across Canada. If we can't help with your specific issue, we'll point you in the right direction.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
