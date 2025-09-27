import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TriageSection from "@/components/TriageSection";
import FeaturesSection from "@/components/FeaturesSection";
import MeritScoreDemo from "@/components/MeritScoreDemo";
import FormPrefillDemo from "@/components/FormPrefillDemo";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Justice-Bot",
    "description": "Affordable AI-powered legal help for Canadians. Get expert guidance for landlord-tenant disputes, human rights issues, small claims court, and more.",
    "url": "https://justice-bot.com",
    "serviceType": [
      "Legal Consultation",
      "Document Preparation", 
      "Court Forms",
      "Legal Analysis"
    ],
    "areaServed": "Canada",
    "offers": {
      "@type": "Offer",
      "price": "5.99",
      "priceCurrency": "CAD"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Affordable Legal Help Canada - AI-Powered Legal Services"
        description="Get affordable legal help for landlord-tenant disputes, human rights issues, small claims court, and employment law. AI-powered legal services starting at $5.99. No expensive lawyers needed."
        keywords="cheap lawyer Canada, affordable legal help, landlord tenant board, human rights tribunal, small claims court, legal advice, AI legal services"
        structuredData={structuredData}
      />
      
      <Header />
      {/* Limited Time Banner */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto">
          <p className="text-sm md:text-base font-semibold">
            🎉 <strong>Limited Time:</strong> First 1,000 users get lifetime free access! 
            <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
              No credit card required
            </span>
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>
      <main>
        <HeroSection />
        <TriageSection />
        <FeaturesSection />
        <MeritScoreDemo />
        <FormPrefillDemo />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
