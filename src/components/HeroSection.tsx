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
      className="relative min-h-[85vh] bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden flex items-center" 
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
          
          {/* Clear outcome-focused headline */}
          <div className="space-y-6 animate-fade-in">
            <h1 
              id="hero-heading" 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground"
            >
              Find out which legal form you need — in 2 minutes
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions. Get your recommended tribunal, forms, and next steps.
            </p>

            {/* Situational urgency */}
            <div className="flex justify-center">
              <UrgencyBlock variant="subtle" />
            </div>
          </div>

          {/* Outcome-based CTAs */}
          <div className="space-y-4 animate-fade-in pt-4">
            {/* Primary CTA - outcome focused */}
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-xl md:text-2xl px-12 py-8 md:py-10 shadow-2xl hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
              onClick={handleFindPath}
            >
              Tell me what form I need
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleCheckOptions}
              >
                Check my legal options
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleHowItWorks}
              >
                <Play className="w-4 h-4 mr-2" />
                See how it works
              </Button>
            </div>

            {/* Trust micro-copy */}
            <p className="text-sm text-muted-foreground pt-2">
              ✓ No signup required • ✓ Free to start • ✓ 2,000+ Canadians helped
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
