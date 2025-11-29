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

const LoadingSection = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
);

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Justice-Bot",
    "description": "Affordable AI-powered legal help for Canadians. Get expert guidance for landlord-tenant disputes, human rights issues, small claims court, and more.",
    "url": "https://www.justice-bot.com",
    "image": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "logo": "https://www.justice-bot.com/justice-bot-logo.jpeg",
    "serviceType": [
      "Legal Consultation",
      "Document Preparation", 
      "Court Forms",
      "Legal Analysis",
      "Case Assessment",
      "Tribunal Navigation"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Canada"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CA",
      "addressRegion": "ON"
    },
    "offers": {
      "@type": "Offer",
      "price": "5.99",
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "247"
    }
  };

  const faqData = [
    {
      question: "Is Justice-Bot really free legal help in Ontario?",
      answer: "Yes! Justice-Bot offers free legal resources, forms, and basic guidance for Ontario residents. For advanced features like AI document drafting and case analysis, we offer affordable subscriptions starting at $5.99/month - a fraction of lawyer costs. We also have special low-income legal aid programs."
    },
    {
      question: "How is Justice-Bot different from legal aid Ontario?",
      answer: "Justice-Bot is an AI legal assistant Canada that provides instant 24/7 help, while traditional legal aid has long wait times and strict income requirements. We're an affordable legal aid alternative with no waiting, serving as your legal chatbot Ontario for immediate guidance on LTB, HRTO, family court, and more."
    },
    {
      question: "Can an AI legal assistant replace a lawyer in Canada?",
      answer: "Justice-Bot is not a replacement for legal advice from a qualified lawyer. We're an AI-powered legal tool that helps you understand your rights, complete forms, and navigate legal processes. For complex cases, we recommend consulting with a lawyer, but Justice-Bot can help you prepare and save on legal costs."
    },
    {
      question: "What types of legal issues does Justice-Bot help with?",
      answer: "Justice-Bot provides legal help Ontario residents need for: Landlord Tenant Board (LTB) disputes, Human Rights Tribunal (HRTO) complaints, family court matters, small claims court, employment issues, and more. We specialize in Ontario legal processes."
    },
    {
      question: "Who qualifies for low-income legal aid through Justice-Bot?",
      answer: "Our low-income legal aid online program is available to Ontario residents who demonstrate financial need. We offer discounted rates and free access to essential legal tools. This is a more accessible alternative to traditional legal aid with no long waiting periods."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://www.justice-bot.com/" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnhancedSEO
        title="Free Legal Help Ontario 2025 | AI Legal Assistant Canada - Justice-Bot"
        description="Get free & low-income legal aid online with Justice-Bot - Canada's #1 AI legal chatbot. Affordable alternative to expensive lawyers for LTB, HRTO, family court & more. Legal help Ontario residents trust. Try free tools or subscribe from $5.99/month."
        keywords="free legal help Ontario, low income legal aid online, legal aid alternatives Canada, AI legal advice Canada, AI legal assistant Canada, Justice-Bot Canada, legal chatbot Ontario, affordable lawyer Canada"
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
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        
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
    </div>
  );
};

export default Index;
