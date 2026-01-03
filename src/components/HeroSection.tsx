import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCheckSituation = () => {
    trackEvent('cta_click', { button: 'check_situation', location: 'hero' });
    navigate('/intake');
  };

  return (
    <section 
      className="relative min-h-[70vh] bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden flex items-center" 
      aria-labelledby="hero-heading" 
      role="banner"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          
          {/* Single clear headline */}
          <div className="space-y-6 animate-fade-in">
            <h1 
              id="hero-heading" 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground"
            >
              Free Legal Help for Canadians (2025)
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Understand your rights. Find the right legal path. Get the correct forms — without a lawyer.
            </p>

            <p className="text-base text-muted-foreground">
              Used by Canadians dealing with housing, family court, child protection, and human rights issues.
            </p>
          </div>

          {/* Single CTA - no pricing, no dashboard, no clutter */}
          <div className="space-y-4 animate-fade-in pt-4">
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-xl px-12 py-8 shadow-2xl hover:scale-[1.02] transition-all duration-300"
              onClick={handleCheckSituation}
            >
              🔴 Check My Situation (2 minutes)
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
