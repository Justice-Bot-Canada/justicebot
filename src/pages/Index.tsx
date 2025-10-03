import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TriageSection from "@/components/TriageSection";
import FeaturesSection from "@/components/FeaturesSection";
import MeritScoreDemo from "@/components/MeritScoreDemo";
import FormPrefillDemo from "@/components/FormPrefillDemo";
import Footer from "@/components/Footer";
import EnhancedSEO from "@/components/EnhancedSEO";
import InteractiveTutorial from "@/components/InteractiveTutorial";
import TrustSignals from "@/components/TrustSignals";
import { AccessibilityPanel } from "@/components/AccessibilityEnhanced";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import SuccessStories from "@/components/SuccessStories";
import TutorialVideos from "@/components/TutorialVideos";
import DocumentTemplates from "@/components/DocumentTemplates";
import legalServicesHero from "@/assets/legal-services-hero.jpg";

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
      answer: "Justice-Bot offers affordable legal guidance starting at $5.99 CAD. We also provide free access to the first 800 users and have special programs for low-income individuals."
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
        title="Affordable Legal Help Canada - AI-Powered Legal Services"
        description="Get affordable legal help for landlord-tenant disputes, human rights issues, small claims court, and employment law. AI-powered legal services starting at $5.99. No expensive lawyers needed."
        keywords="cheap lawyer Canada, affordable legal help, landlord tenant board, human rights tribunal, small claims court, legal advice, AI legal services"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
        faqData={faqData}
      />
      
      <Header />
      {/* Limited Time Banner */}
      <div 
        className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-4 text-center relative overflow-hidden"
        role="banner"
        aria-label="Promotional offer"
      >
        <div className="container mx-auto">
          <p className="text-sm md:text-base font-semibold">
            🎉 <strong>Limited Time:</strong> First 800 users get lifetime free access! 
            <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
              No credit card required
            </span>
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" aria-hidden="true"></div>
      </div>
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        
        {/* Interactive Tutorial Section */}
        <section id="tutorials" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <InteractiveTutorial />
          </div>
        </section>
        
        <TriageSection />
        <TrustSignals />
        <SuccessStories />
        
        {/* Tutorial Videos Preview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Step-by-Step Video Guides</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Watch detailed tutorials showing you exactly how to file forms, gather evidence, and present your case effectively.
              </p>
              <a href="/tutorials" className="inline-flex items-center gap-2 text-primary hover:underline">
                View All Tutorials →
              </a>
            </div>
            <TutorialVideos />
          </div>
        </section>

        {/* Document Templates Preview */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Professional Document Templates</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Download ready-to-use templates for letters, evidence organization, witness statements, and more.
              </p>
              <a href="/templates" className="inline-flex items-center gap-2 text-primary hover:underline">
                Browse All Templates →
              </a>
            </div>
            <DocumentTemplates />
          </div>
        </section>
        
        <FeaturesSection />
        <section id="merit" aria-labelledby="merit-heading">
          <MeritScoreDemo />
        </section>
        <FormPrefillDemo />
      </main>
      <Footer />
      <AccessibilityPanel />
    </div>
  );
};

export default Index;
