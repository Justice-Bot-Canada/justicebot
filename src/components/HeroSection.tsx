import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Scale, Shield } from "lucide-react";
import { trackEvent, analytics } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UrgencyBlock from "@/components/UrgencyBlock";
import canadaFlagHero from "@/assets/canada-flag-hero.png";

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
    const videoSection = document.getElementById('how-it-works');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] overflow-hidden flex items-center" 
      aria-labelledby="hero-heading" 
      role="banner"
    >
      {/* Hero background image - weathered Canadian flag */}
      <div 
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <img 
          src={canadaFlagHero}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        {/* Red accent overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          
          {/* Company branding */}
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-primary" aria-hidden="true" />
              <span className="text-sm sm:text-base font-semibold tracking-widest uppercase text-primary">
                Justice Bot Technologies Inc.
              </span>
            </div>
            
            {/* Main headline */}
            <h1 
              id="hero-heading" 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-white text-shadow-hero"
            >
              Know Your Rights.
              <br />
              <span className="text-primary">Fight Back.</span>
            </h1>
            
            {/* Tagline */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/90 mt-4 border-l-4 border-primary pl-4">
              ignorance is not an option
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mt-4">
              Free legal navigation for Canadians. Find your forms, understand your rights, and take action — all in minutes.
            </p>

            {/* Situational urgency */}
            <div className="pt-4">
              <UrgencyBlock variant="subtle" />
            </div>
          </div>

          {/* Outcome-based CTAs */}
          <div className="space-y-4 animate-fade-in pt-4">
            {/* Primary CTA */}
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-base sm:text-lg md:text-xl lg:text-2xl px-8 sm:px-10 md:px-14 py-6 sm:py-7 md:py-8 lg:py-10 shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 border-primary-foreground/20"
              onClick={handleFindPath}
            >
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-3" aria-hidden="true" />
              Tell me what form I need
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
            
            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button 
                variant="outline" 
                size="default"
                className="text-sm sm:text-base bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                onClick={handleCheckOptions}
              >
                Check my legal options
              </Button>
              
              <Button 
                variant="ghost" 
                size="default"
                className="text-white/80 hover:text-white hover:bg-white/10 text-sm sm:text-base"
                onClick={handleHowItWorks}
              >
                <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                See how it works
              </Button>
            </div>

            {/* Trust micro-copy */}
            <p className="text-sm text-white/70 pt-2 flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full" aria-hidden="true" />
                No signup required
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full" aria-hidden="true" />
                Free to start
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-primary rounded-full" aria-hidden="true" />
                2,000+ Canadians helped
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;