import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TriageSection from "@/components/TriageSection";
import FeaturesSection from "@/components/FeaturesSection";
import MeritScoreDemo from "@/components/MeritScoreDemo";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
