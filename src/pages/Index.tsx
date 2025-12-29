import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ClinicWelcomeBanner from "@/components/ClinicWelcomeBanner";
import { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Lazy load ALL below-the-fold components for better LCP/FCP
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const AppDemoVideo = lazy(() => import("@/components/AppDemoVideo").then(m => ({ default: m.AppDemoVideo })));
const ExplainerVideo = lazy(() => import("@/components/ExplainerVideo").then(m => ({ default: m.ExplainerVideo })));
const InteractiveTutorial = lazy(() => import("@/components/InteractiveTutorial"));
const TrustSignals = lazy(() => import("@/components/TrustSignals"));
const SuccessStories = lazy(() => import("@/components/SuccessStories"));
const PricingTeaser = lazy(() => import("@/components/PricingTeaser").then(m => ({ default: m.PricingTeaser })));
const JourneyFlowchart = lazy(() => import("@/components/JourneyFlowchart").then(m => ({ default: m.JourneyFlowchart })));
const CompetitorComparison = lazy(() => import("@/components/CompetitorComparison"));
const MoneyBackGuarantee = lazy(() => import("@/components/MoneyBackGuarantee").then(m => ({ default: m.MoneyBackGuarantee })));
const UrgencyTimer = lazy(() => import("@/components/UrgencyTimer").then(m => ({ default: m.UrgencyTimer })));
const FeatureHighlightBanner = lazy(() => import("@/components/FeatureHighlightBanner"));
const ProvincesBanner = lazy(() => import("@/components/ProvincesBanner").then(m => ({ default: m.ProvincesBanner })));
const QuickToolsSection = lazy(() => import("@/components/QuickToolsSection"));
const ConversionFAQ = lazy(() => import("@/components/ConversionFAQ"));

// Lazy load only essential widgets - removed excessive popups for cleaner UX
const CrispChat = lazy(() => import("@/components/CrispChat"));
const AccessibilityPanel = lazy(() => import("@/components/AccessibilityEnhanced").then(m => ({ default: m.AccessibilityPanel })));
const LoadingSection = () => (
  <div className="py-8 flex items-center justify-center min-h-[100px]">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Justice-Bot",
    "applicationCategory": "Legal",
    "operatingSystem": "Web",
    "description": "AI-powered legal information and form guidance for Canadians nationwide. Covering all provinces and territories with tenancy, human rights, family, and small claims guidance. Not a law firm - a practical tool to help you understand forms and procedures.",
    "url": "https://www.justice-bot.com",
    "image": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "offers": {
      "@type": "Offer",
      "price": "5.99",
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    }
  };

  const faqData = [
    {
      question: "What provinces does Justice-Bot serve?",
      answer: "Justice-Bot currently serves Ontario, Alberta, British Columbia, and Quebec with province-specific court forms, tribunal guidance, and legal information. Each province has its own tribunals and procedures, and Justice-Bot provides tailored support for LTB/RTB/TAL tenancy disputes, human rights complaints, family court, small claims, and more."
    },
    {
      question: "Is Justice-Bot really free legal information in Canada?",
      answer: "Justice-Bot offers free and low-cost legal information tools, form helpers, and process guidance for residents of Ontario, Alberta, BC, and Quebec. Some tools are free, and forms are available for just $5.99 each. We are not a law firm, but we help you understand your options and prepare."
    },
    {
      question: "How is Justice-Bot different from Legal Aid?",
      answer: "Legal Aid programs can sometimes provide lawyers or full representation if you qualify. Justice-Bot is different: we're an AI-powered assistant that gives 24/7 information, form helpers, and step-by-step guidance. We don't provide legal representation or legal advice, but we help you understand forms, rules, and procedures so you can move forward with more confidence."
    },
    {
      question: "Can an AI assistant replace a lawyer in Canada?",
      answer: "Justice-Bot is not a replacement for legal advice from a qualified lawyer. We're an AI-powered tool that helps you understand your rights, complete forms, and navigate legal processes. For complex cases, we recommend consulting with a lawyer; Justice-Bot can help you prepare and save on legal costs. Justice-Bot is not a law firm and does not provide legal representation."
    },
    {
      question: "What types of legal issues does Justice-Bot help with?",
      answer: "Justice-Bot provides legal information and form guidance for Canadians dealing with: tenancy disputes (LTB in Ontario, RTB in BC, RTDRS in Alberta, TAL in Quebec), Human Rights Tribunal complaints, family court matters, small claims court, employment issues, and more. We help you understand procedures and complete forms - we are not lawyers and do not provide legal advice."
    },
    {
      question: "What is Justice-Bot's low-income program?",
      answer: "Our accessibility program offers discounted rates for Canadian residents who demonstrate financial need. We provide affordable access to legal information tools and form helpers. This is not legal aid or legal representation - it's a practical resource to help you prepare and understand your options."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://www.justice-bot.com/" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Justice Bot | FREE Legal Help Canada 2025 | Court Forms $5.99"
        description="Justice Bot: Canada's #1 AI legal assistant. FREE case assessment + LTB T2 forms, HRTO, eviction defence & more from $5.99. Stop landlord abuse. Fight N4 notices. 10,000+ helped."
        keywords="justice bot, legal help Canada, free legal help, LTB T2 form, filing a T2 against landlord, form t2 ltb, how to fight an n8, how to stop eviction ontario, tenant rights Canada"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      {/* Critical resource preload for LCP improvement */}
      <ClinicWelcomeBanner />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        
        {/* How It Works - 3-Step Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to understand your legal situation
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-background rounded-xl border shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Describe Your Issue</h3>
                <p className="text-muted-foreground">
                  Tell us about your legal situation in plain language. Our AI understands context and asks clarifying questions.
                </p>
              </div>
              <div className="text-center p-6 bg-background rounded-xl border shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Your Pathway</h3>
                <p className="text-muted-foreground">
                  Receive a personalized roadmap showing which tribunals, forms, and steps apply to your situation.
                </p>
              </div>
              <div className="text-center p-6 bg-background rounded-xl border shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Prepare Your Case</h3>
                <p className="text-muted-foreground">
                  Upload evidence, generate documents, and track deadlines — all in one organized workspace.
                </p>
              </div>
            </div>
            <div className="text-center mt-10">
              <a 
                href="/welcome" 
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              >
                Start Free Assessment
              </a>
            </div>
          </div>
        </section>

        {/* What We Cover / What We Don't Do */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Clear About What We Do</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Justice-Bot is a legal information tool — not a law firm
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                  <span className="text-2xl">✓</span> What We Help With
                </h3>
                <ul className="space-y-3 text-green-800 dark:text-green-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                    <span>Understanding which tribunal or court handles your issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                    <span>Finding and completing the right forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                    <span>Organizing your evidence and documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                    <span>Tracking deadlines and procedural steps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                    <span>Explaining legal processes in plain language</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
                <h3 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-400 flex items-center gap-2">
                  <span className="text-2xl">✗</span> What We Don't Do
                </h3>
                <ul className="space-y-3 text-red-800 dark:text-red-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                    <span>Provide legal advice or opinions on your case</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                    <span>Represent you in court or at hearings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                    <span>Create lawyer-client relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                    <span>Guarantee any legal outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                    <span>Replace consultation with a qualified lawyer</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Block */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-5 bg-background rounded-lg border text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h4 className="font-semibold mb-1">Your Data is Encrypted</h4>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade encryption protects everything you share. We never sell your data.
                </p>
              </div>
              <div className="p-5 bg-background rounded-lg border text-center">
                <div className="text-3xl mb-2">🇨🇦</div>
                <h4 className="font-semibold mb-1">Canadian Data Storage</h4>
                <p className="text-sm text-muted-foreground">
                  All data stored on Canadian servers. PIPEDA compliant with strict access controls.
                </p>
              </div>
              <div className="p-5 bg-background rounded-lg border text-center">
                <div className="text-3xl mb-2">⚖️</div>
                <h4 className="font-semibold mb-1">Not Legal Advice</h4>
                <p className="text-sm text-muted-foreground">
                  Information tool only. Always consult a lawyer for legal advice on your specific situation.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Lazy load below-hero content */}
        <Suspense fallback={null}>
          <ProvincesBanner />
        </Suspense>
        
        <Suspense fallback={null}>
          <FeatureHighlightBanner />
        </Suspense>
        
        <Suspense fallback={null}>
          <div className="container mx-auto px-4 py-4">
            <UrgencyTimer />
          </div>
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <QuickToolsSection />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <JourneyFlowchart />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <PricingTeaser />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <ExplainerVideo />
        </Suspense>
        
        {/* Interactive Tutorial Section */}
        <section id="tutorials" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSection />}>
              <InteractiveTutorial />
            </Suspense>
          </div>
        </section>
        
        {/* CTA Section - Encourage sign up */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Understand Your Legal Options?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Create a free account to access AI-powered case analysis, document review, and step-by-step guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/welcome" 
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              >
                Start Your Case
              </a>
              <a 
                href="/auth" 
                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-8 py-3 text-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </section>

        <Suspense fallback={<LoadingSection />}>
          <TrustSignals />
        </Suspense>
        
        {/* Money-Back Guarantee */}
        <section className="py-8 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<LoadingSection />}>
              <MoneyBackGuarantee />
            </Suspense>
          </div>
        </section>
        
        <Suspense fallback={<LoadingSection />}>
          <SuccessStories />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <FeaturesSection />
        </Suspense>
        
        {/* Competitor Comparison */}
        <Suspense fallback={<LoadingSection />}>
          <CompetitorComparison />
        </Suspense>
        
        {/* Conversion-focused FAQ - handles objections */}
        <Suspense fallback={<LoadingSection />}>
          <ConversionFAQ />
        </Suspense>
        
        <Suspense fallback={<LoadingSection />}>
          <AppDemoVideo />
        </Suspense>
        
        {/* Temporarily disabled lead magnets until Turnstile is properly configured */}
        {/* 
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Free Legal Resources for Canadians</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get instant access to expert legal guides and templates - no credit card required
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <LeadMagnetCard
                title="Ontario Legal Rights Guide 2025"
                description="Complete guide to your rights in landlord disputes, employment, and more"
                benefits={[
                  "Know your rights in 15+ legal situations",
                  "Step-by-step tribunal procedures",
                  "Common mistakes to avoid"
                ]}
                downloadType="guide"
                journey="general"
              />
              <LeadMagnetCard
                title="LTB Form T2 Template"
                description="Professional template for tenant applications against landlords"
                benefits={[
                  "Pre-filled sections & examples",
                  "Legal language included",
                  "Increases your success rate"
                ]}
                downloadType="template"
                journey="ltb"
              />
              <LeadMagnetCard
                title="Small Claims Checklist"
                description="Everything you need before filing in Small Claims Court"
                benefits={[
                  "Complete document checklist",
                  "Timeline & deadline tracker",
                  "Evidence preparation tips"
                ]}
                downloadType="checklist"
                journey="small_claims"
              />
            </div>
          </div>
        </section>
        */}
      </main>
      <Footer />
      
      {/* Only essential widgets - removed excessive popups */}
      <Suspense fallback={null}>
        <AccessibilityPanel />
      </Suspense>
      
      {/* Crisp for live chat support */}
      <Suspense fallback={null}>
        <CrispChat />
      </Suspense>
    </div>
  );
};

export default Index;
