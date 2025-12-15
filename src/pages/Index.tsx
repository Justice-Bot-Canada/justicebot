import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import MeritScoreCalculator from "@/components/MeritScoreCalculator";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { AccessibilityPanel } from "@/components/AccessibilityEnhanced";
import { SocialProofTicker } from "@/components/SocialProofTicker";
import { UrgencyTimer } from "@/components/UrgencyTimer";
import { MoneyBackGuarantee } from "@/components/MoneyBackGuarantee";
import LiveSupportWidget from "@/components/LiveSupportWidget";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { StickyBottomCTA } from "@/components/StickyBottomCTA";
import { ProvincesBanner } from "@/components/ProvincesBanner";
import CrispChat from "@/components/CrispChat";
import FeatureHighlightBanner from "@/components/FeatureHighlightBanner";
import { Suspense, lazy } from "react";

// Lazy load below-the-fold components for better LCP
const TriageSection = lazy(() => import("@/components/TriageSection"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const AppDemoVideo = lazy(() => import("@/components/AppDemoVideo").then(m => ({ default: m.AppDemoVideo })));
const ExplainerVideo = lazy(() => import("@/components/ExplainerVideo").then(m => ({ default: m.ExplainerVideo })));
const InteractiveTutorial = lazy(() => import("@/components/InteractiveTutorial"));
const TrustSignals = lazy(() => import("@/components/TrustSignals"));
const SuccessStories = lazy(() => import("@/components/SuccessStories"));
const DocumentTemplates = lazy(() => import("@/components/DocumentTemplates"));
const PricingComparison = lazy(() => import("@/components/PricingComparison").then(m => ({ default: m.PricingComparison })));
const JourneyFlowchart = lazy(() => import("@/components/JourneyFlowchart").then(m => ({ default: m.JourneyFlowchart })));
const NewsletterBanner = lazy(() => import("@/components/NewsletterBanner").then(m => ({ default: m.NewsletterBanner })));
const CompetitorComparison = lazy(() => import("@/components/CompetitorComparison"));

const LoadingSection = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
);

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Justice-Bot",
    "applicationCategory": "Legal",
    "operatingSystem": "Web",
    "description": "AI-powered legal information and form guidance for Canadians in Ontario, Alberta, and British Columbia facing housing, human rights, family, and small claims issues. Not a law firm - a practical tool to help you understand forms and procedures.",
    "url": "https://www.justice-bot.com",
    "image": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "offers": {
      "@type": "Offer",
      "price": "5.99",
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31"
    },
    "areaServed": [
      { "@type": "State", "name": "Ontario" },
      { "@type": "State", "name": "Alberta" },
      { "@type": "State", "name": "British Columbia" }
    ]
  };

  const faqData = [
    {
      question: "What provinces does Justice-Bot serve?",
      answer: "Justice-Bot currently serves Ontario, Alberta, and British Columbia with province-specific court forms, tribunal guidance, and legal information. Each province has its own tribunals and procedures, and Justice-Bot provides tailored support for LTB/RTB tenancy disputes, human rights complaints, family court, small claims, and more."
    },
    {
      question: "Is Justice-Bot really free legal information in Canada?",
      answer: "Justice-Bot offers free and low-cost legal information tools, form helpers, and process guidance for residents of Ontario, Alberta, and BC. Some tools are free, and advanced AI features are available by subscription starting at $5.99/month. We are not a law firm, but we help you understand your options and prepare."
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
      answer: "Justice-Bot provides legal information and form guidance for Canadians dealing with: tenancy disputes (LTB in Ontario, RTB in BC, RTDRS in Alberta), Human Rights Tribunal complaints, family court matters, small claims court, employment issues, and more. We help you understand procedures and complete forms - we are not lawyers and do not provide legal advice."
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
        title="Legal Help Canada 2025 | Ontario, Alberta, BC Court Forms - Justice-Bot"
        description="AI-powered legal form helper for Ontario, Alberta & BC. Get court forms, tribunal guidance, and step-by-step help for LTB, RTB, HRTO, family court, small claims. Not a law firm - practical tools to prepare your case."
        keywords="legal help Canada, Ontario court forms, Alberta legal forms, BC RTB forms, LTB help Ontario, RTDRS Alberta, human rights tribunal Canada, small claims court Canada, family court forms, legal self-help Canada, tenant rights Canada"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      {/* Critical resource preload for LCP improvement */}
      <link rel="preload" as="image" href="/hero-desktop.webp" type="image/webp" media="(min-width: 768px)" />
      <link rel="preload" as="image" href="/hero-mobile.webp" type="image/webp" media="(max-width: 767px)" />
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <PerformanceMonitor />
      
      <Header />
      {/* Provinces Coming Soon Banner */}
      <ProvincesBanner />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        
        {/* Feature Highlight Banner - Right after hero */}
        <FeatureHighlightBanner />
        
        {/* Urgency Timer */}
        <div className="container mx-auto px-4 py-4">
          <UrgencyTimer />
        </div>
        <Suspense fallback={<LoadingSection />}>
          <JourneyFlowchart />
        </Suspense>
        <Suspense fallback={<LoadingSection />}>
          <PricingComparison />
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
        
        <Suspense fallback={<LoadingSection />}>
          <TriageSection />
        </Suspense>

        {/* Merit Score Calculator Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Check Your Case Strength</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get an instant AI-powered assessment of your legal case merit score
              </p>
            </div>
            <MeritScoreCalculator />
          </div>
        </section>

        <Suspense fallback={<LoadingSection />}>
          <TrustSignals />
        </Suspense>
        
        {/* Money-Back Guarantee */}
        <section className="py-8 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <MoneyBackGuarantee />
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
      <AccessibilityPanel />
      
      {/* Exit-Intent Popup */}
      <LeadCaptureModal trigger="exit" />
      
      {/* Social Proof Ticker */}
      <SocialProofTicker />
      
      {/* Live Support Widget */}
      <LiveSupportWidget />
      
      {/* Sticky Bottom CTA with Promo Code */}
      <StickyBottomCTA />
      
      {/* Crisp Live Chat Widget */}
      <CrispChat />
    </div>
  );
};

export default Index;
