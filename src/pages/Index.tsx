import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ClinicWelcomeBanner from "@/components/ClinicWelcomeBanner";
import ConversationalOnboarding from "@/components/ConversationalOnboarding";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { analytics } from "@/utils/analytics";

/**
 * Index - Landing Page with Hero and Conversational Onboarding
 * 
 * Restored: Tattered flag hero with dark/red theme
 * Below: Conversational onboarding for new users
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
        description="Know your rights. Fight back. Free legal navigation for Canadians — find your forms, understand your rights, and take action."
        keywords="legal help Canada, legal forms Canada, tenant rights Ontario, HRTO complaint, LTB forms, small claims court"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
      />
      <LocalBusinessSchema />
      <ClinicWelcomeBanner />
      <Header />
      
      <main id="main-content" tabIndex={-1}>
        {/* Hero Section - Tattered Flag, Dark/Red Theme */}
        <HeroSection />

        {/* Conversational Onboarding - Below Hero */}
        <section id="get-started" className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
                Not sure where to start?
              </h2>
              <p className="text-lg text-muted-foreground">
                Answer a few quick questions. We'll show you what forms and processes may apply — no signup required.
              </p>
            </div>
            <ConversationalOnboarding />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
