import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
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
              Not sure what form to file — or what happens next?
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions about your situation. We'll tell you which tribunal handles it, what form you need, and what to do first.
            </p>
          </div>

          {/* Single CTA - low friction */}
          <div className="space-y-4 animate-fade-in pt-4">
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-xl px-12 py-8 shadow-2xl hover:scale-[1.02] transition-all duration-300"
              onClick={handleCheckSituation}
            >
              Check My Situation
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Takes about 2 minutes • No signup required</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
