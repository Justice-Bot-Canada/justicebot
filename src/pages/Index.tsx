import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ClinicWelcomeBanner from "@/components/ClinicWelcomeBanner";
import ExitIntentModal from "@/components/ExitIntentModal";
import StickyLeadCapture from "@/components/StickyLeadCapture";
import FounderTrustBlock from "@/components/FounderTrustBlock";
import LegalPathReportCTA from "@/components/LegalPathReportCTA";
import { MeritScoreCTA } from "@/components/MeritScoreCTA";
import { Suspense, lazy, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analytics, trackEvent } from "@/utils/analytics";

// Lazy load below-the-fold components
const TrustSignals = lazy(() => import("@/components/TrustSignals"));
const ConversionFAQ = lazy(() => import("@/components/ConversionFAQ"));

const LoadingSection = () => (
  <div className="py-8 flex items-center justify-center min-h-[100px]">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);
  const exitIntentTriggered = useRef(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Track landing view for funnel analytics
  useEffect(() => {
    if (!loading && !user) {
      analytics.landingView();
    }
  }, [loading, user]);

  // Exit intent detection
  useEffect(() => {
    const hasSeenExitModal = localStorage.getItem('exit_modal_shown');
    if (hasSeenExitModal) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTriggered.current) {
        exitIntentTriggered.current = true;
        setShowExitModal(true);
        localStorage.setItem('exit_modal_shown', 'true');
        trackEvent('exit_intent_triggered', {});
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleGetCourtReadyDocs = () => {
    navigate('/triage');
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Justice-Bot",
    "applicationCategory": "Legal",
    "operatingSystem": "Web",
    "description": "AI-powered legal information and form guidance for Canadians. Covering all provinces and territories with tenancy, human rights, family, and small claims guidance.",
    "url": "https://www.justice-bot.com",
    "image": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    }
  };

  const faqData = [
    {
      question: "What is Justice-Bot?",
      answer: "Justice-Bot is a free legal orientation tool that helps you understand which tribunal or court handles your situation, what forms you need, and what steps to take. We don't provide legal advice — we help you understand the process."
    },
    {
      question: "Is Justice-Bot free?",
      answer: "The triage and orientation are completely free. You can create a free account to save your results and upload evidence. A subscription is only needed to generate the final court-ready Book of Documents."
    },
    {
      question: "Does Justice-Bot provide legal advice?",
      answer: "No. Justice-Bot is a legal information tool, not a law firm. We help you understand processes and prepare documents, but for legal advice specific to your situation, you should consult a qualified lawyer."
    },
    {
      question: "What types of legal issues does Justice-Bot help with?",
      answer: "We help with housing disputes (LTB), human rights complaints (HRTO), small claims court, family matters, and other tribunal processes in Ontario and across Canada."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://www.justice-bot.com/" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Justice-Bot | Free Legal Help Tool for Canadians"
        description="Fight eviction, file HRTO complaints, or navigate small claims court. Free AI-powered legal orientation helps you find the right forms, understand deadlines, and prepare court-ready documents in minutes."
        keywords="free legal help Canada, fight eviction Ontario, LTB forms, HRTO complaint, small claims court Ontario, tenant rights, self-represented litigant, legal aid alternative, affordable legal help"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      <ClinicWelcomeBanner />
      <Header />
      
      {/* HIGH-VISIBILITY URGENCY CTA - Merit Score */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-b-2 border-amber-500/30 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <MeritScoreCTA variant="hero" />
          </div>
        </div>
      </section>

      {/* Trust Banner - Above the fold - Outcome focused */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20 py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
              Not sure what you're dealing with?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Answer a few questions. Get your recommended forms and next steps.
            </p>
            <Button
              size="default"
              onClick={handleGetCourtReadyDocs}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Check my legal options now
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              No signup • Free to start • 2,000+ Canadians helped
            </p>
          </div>
        </div>
      </section>

      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        
        {/* What We Do / Don't Do - Clear trust building */}
        <section id="what-we-do" className="py-8 sm:py-12 md:py-16 bg-background">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Clear About What We Do</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Justice-Bot is a legal information tool — not a law firm
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
              <Card className="p-4 sm:p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">✓</span> What We Help With
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-green-800 dark:text-green-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">•</span>
                    <span>Understanding which tribunal or court handles your issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">•</span>
                    <span>Finding and completing the right forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">•</span>
                    <span>Organizing your evidence and documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">•</span>
                    <span>Tracking deadlines and procedural steps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">•</span>
                    <span>Explaining legal processes in plain language</span>
                  </li>
                </ul>
              </Card>
              <Card className="p-4 sm:p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-red-700 dark:text-red-400 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">✗</span> What We Don't Do
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-red-800 dark:text-red-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 sm:mt-1">•</span>
                    <span>Provide legal advice or opinions on your case</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 sm:mt-1">•</span>
                    <span>Represent you in court or at hearings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 sm:mt-1">•</span>
                    <span>Create lawyer-client relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 sm:mt-1">•</span>
                    <span>Guarantee any legal outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-0.5 sm:mt-1">•</span>
                    <span>Replace consultation with a qualified lawyer</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust & Security Block */}
        <section className="py-8 sm:py-10 md:py-12 bg-muted/50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <Card className="p-4 sm:p-5 bg-background text-center">
                <div className="text-2xl sm:text-3xl mb-2">🔒</div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base">Your Data is Encrypted</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enterprise-grade encryption. We never sell your data.
                </p>
              </Card>
              <Card className="p-4 sm:p-5 bg-background text-center">
                <div className="text-2xl sm:text-3xl mb-2">🇨🇦</div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base">Canadian Data Storage</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All data stored on Canadian servers. PIPEDA compliant.
                </p>
              </Card>
              <Card className="p-4 sm:p-5 bg-background text-center">
                <div className="text-2xl sm:text-3xl mb-2">⚖️</div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base">Not Legal Advice</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Information tool only. Consult a lawyer for legal advice.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* $5.99 Starter Product CTA */}
        <section className="py-8 sm:py-10 md:py-12 bg-background">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-xl mx-auto">
              <LegalPathReportCTA />
            </div>
          </div>
        </section>

        {/* Founder Trust Block */}
        <section className="py-8 sm:py-10 md:py-12 bg-muted/30">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-4xl mx-auto">
              <FounderTrustBlock />
            </div>
          </div>
        </section>

        <Suspense fallback={<LoadingSection />}>
          <TrustSignals />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <ConversionFAQ />
        </Suspense>
      </main>
      <Footer />
      
      {/* Exit Intent Modal */}
      <ExitIntentModal 
        isOpen={showExitModal} 
        onClose={() => setShowExitModal(false)} 
      />
      
      {/* Sticky Bottom Lead Capture */}
      <StickyLeadCapture />
    </div>
  );
};

export default Index;
