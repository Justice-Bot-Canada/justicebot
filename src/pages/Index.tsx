import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { Suspense, lazy } from "react";

// Lazy load ALL below-the-fold components for better LCP/FCP
const MeritScoreCalculator = lazy(() => import("@/components/MeritScoreCalculator"));
const TriageSection = lazy(() => import("@/components/TriageSection"));
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

// Lazy load non-critical widgets (load after main content)
const SocialProofTicker = lazy(() => import("@/components/SocialProofTicker").then(m => ({ default: m.SocialProofTicker })));
const LeadCaptureModal = lazy(() => import("@/components/LeadCaptureModal").then(m => ({ default: m.LeadCaptureModal })));
const StickyBottomCTA = lazy(() => import("@/components/StickyBottomCTA").then(m => ({ default: m.StickyBottomCTA })));
const ChurnPreventionNudge = lazy(() => import("@/components/ChurnPreventionNudge").then(m => ({ default: m.ChurnPreventionNudge })));
const CrispChat = lazy(() => import("@/components/CrispChat"));
const LiveSupportWidget = lazy(() => import("@/components/LiveSupportWidget"));
const AccessibilityPanel = lazy(() => import("@/components/AccessibilityEnhanced").then(m => ({ default: m.AccessibilityPanel })));

const LoadingSection = () => (
  <div className="py-8 flex items-center justify-center min-h-[100px]">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
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
        title="FREE Legal Help Canada 2025 | Court Forms $5.99 | Nationwide Coverage"
        description="Get FREE case assessment + court forms from $5.99. LTB, HRTO, RTB, RTDRS, TAL + more. AI-powered legal guidance for all provinces. 10,000+ Canadians helped. Not a law firm."
        keywords="legal help Canada, free legal help, Canadian court forms, LTB help, HRTO Ontario, RTDRS Alberta, BC RTB, Quebec TAL, tenant rights Canada, human rights complaint, small claims court"
        canonicalUrl="https://www.justice-bot.com/"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      <LocalBusinessSchema />
      {/* Critical resource preload for LCP improvement */}
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        
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
      
      {/* Defer non-critical widgets to after main content renders */}
      <Suspense fallback={null}>
        <AccessibilityPanel />
      </Suspense>
      
      <Suspense fallback={null}>
        <LeadCaptureModal trigger="time" delaySeconds={45} />
      </Suspense>
      
      <Suspense fallback={null}>
        <SocialProofTicker />
      </Suspense>
      
      <Suspense fallback={null}>
        <LiveSupportWidget />
      </Suspense>
      
      <Suspense fallback={null}>
        <StickyBottomCTA />
      </Suspense>
      
      <Suspense fallback={null}>
        <CrispChat />
      </Suspense>
      
      <Suspense fallback={null}>
        <ChurnPreventionNudge />
      </Suspense>
    </div>
  );
};

export default Index;
