import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TriageSection from "@/components/TriageSection";
import FeaturesSection from "@/components/FeaturesSection";
import { AppDemoVideo } from "@/components/AppDemoVideo";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import InteractiveTutorial from "@/components/InteractiveTutorial";
import TrustSignals from "@/components/TrustSignals";
import { AccessibilityPanel } from "@/components/AccessibilityEnhanced";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import SuccessStories from "@/components/SuccessStories";
import TutorialVideos from "@/components/TutorialVideos";
import DocumentTemplates from "@/components/DocumentTemplates";
import { PricingComparison } from "@/components/PricingComparison";
import legalServicesHero from "@/assets/legal-services-hero.jpg";
import { JourneyFlowchart } from "@/components/JourneyFlowchart";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Justice-Bot",
    "description": "Affordable AI-powered legal help for Canadians. Get expert guidance for landlord-tenant disputes, human rights issues, small claims court, and more.",
    "url": "https://justice-bot.com",
    "image": "https://justice-bot.com/legal-services-hero.jpg",
    "logo": "https://justice-bot.com/justice-bot-logo.jpeg",
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
      question: "How much does Justice-Bot cost?",
      answer: "Justice-Bot offers affordable legal guidance with subscription plans starting at $5.99 CAD per month. We have special programs for low-income individuals."
    },
    {
      question: "Can Justice-Bot replace a lawyer?",
      answer: "No, Justice-Bot is not a replacement for legal advice from a qualified lawyer. We provide guidance, forms, and information to help you navigate legal processes, but complex cases may require professional legal representation."
    },
    {
      question: "What types of legal issues does Justice-Bot help with?",
      answer: "Justice-Bot helps with landlord-tenant disputes, human rights complaints, small claims court cases, employment issues, and family law matters in Ontario, Canada."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "https://justice-bot.com/" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PerformanceMonitor />
      <EnhancedSEO
        title="Affordable Legal Help Canada (Ontario) - AI-Powered Legal Services"
        description="Get affordable legal help for landlord-tenant disputes, human rights issues, small claims court, and employment law in Ontario. AI-powered legal services starting at $5.99. No expensive lawyers needed."
        keywords="cheap lawyer Canada, affordable legal help Ontario, landlord tenant board, human rights tribunal, small claims court, legal advice, AI legal services"
        canonicalUrl="https://justice-bot.com/"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <JourneyFlowchart />
        <PricingComparison />
        <ExplainerVideo />
        
        {/* Interactive Tutorial Section */}
        <section id="tutorials" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <InteractiveTutorial />
          </div>
        </section>
        
        <TriageSection />
        <TrustSignals />
        <SuccessStories />
        
        <FeaturesSection />
        <AppDemoVideo />
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
};

export default Index;
