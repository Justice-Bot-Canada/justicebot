import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Clock } from "lucide-react";
import { trackEvent, analytics } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import UrgencyBlock from "@/components/UrgencyBlock";

const HeroSection = () => {
  const navigate = useNavigate();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleFindPath = () => {
    trackEvent('cta_click', { button: 'find_my_path', location: 'hero' });
    analytics.funnelStart(window.location.pathname);
    navigate('/funnel');
  };

  const handleCheckOptions = () => {
    trackEvent('cta_click', { button: 'check_legal_options', location: 'hero' });
    analytics.funnelStart(window.location.pathname);
    navigate('/triage');
  };

  const handleHowItWorks = () => {
    trackEvent('cta_click', { button: 'how_it_works', location: 'hero' });
    const trustSection = document.getElementById('what-we-do');
    if (trustSection) {
      trustSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden flex items-center" 
      aria-labelledby="hero-heading" 
      role="banner"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-accent/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-8">
          
          {/* Clear outcome-focused headline */}
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            <h1 
              id="hero-heading" 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-foreground px-2"
            >
              Find out which legal form you need — in 2 minutes
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-4">
              Answer a few questions. Get your recommended tribunal, forms, and next steps.
            </p>

            {/* Situational urgency */}
            <div className="flex justify-center">
              <UrgencyBlock variant="subtle" />
            </div>
          </div>

          {/* Outcome-based CTAs */}
          <div className="space-y-3 sm:space-y-4 animate-fade-in pt-2 sm:pt-4 px-2">
            {/* Primary CTA - outcome focused */}
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-base sm:text-lg md:text-xl lg:text-2xl px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-8 lg:py-10 shadow-2xl hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
              onClick={handleFindPath}
            >
              Tell me what form I need
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                size="default"
                className="w-full sm:w-auto text-sm sm:text-base"
                onClick={handleCheckOptions}
              >
                Check my legal options
              </Button>
              
              <Button 
                variant="ghost" 
                size="default"
                className="text-muted-foreground hover:text-foreground text-sm sm:text-base"
                onClick={handleHowItWorks}
              >
                <Play className="w-4 h-4 mr-2" />
                See how it works
              </Button>
            </div>

            {/* Trust micro-copy */}
            <p className="text-xs sm:text-sm text-muted-foreground pt-2">
              ✓ No signup • ✓ Free to start • ✓ 2,000+ helped
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
