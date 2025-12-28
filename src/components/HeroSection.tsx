import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Clock, AlertTriangle } from "lucide-react";
import { trackEvent, analytics } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    trackEvent('cta_click', { button: 'hero_assessment', location: 'hero' });
    navigate('/triage');
  };

  return (
    <section 
      className="relative min-h-[85vh] bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden" 
      aria-labelledby="hero-heading" 
      role="banner"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Main headline - speaks to outcome */}
          <div className="space-y-4 animate-fade-in">
            <h1 
              id="hero-heading" 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
            >
              <span className="text-foreground">Justice-Bot:</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Legal Ally in Canada
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Get an instant legal roadmap — <strong className="text-foreground">no lawyer needed.</strong>
            </p>
          </div>

          {/* Value bullets - immediate clarity */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-left animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">Find your exact tribunal/form (LTB, HRTO, Small Claims)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">Get a score showing your case strength</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-foreground">Step-by-step instructions in plain language</span>
            </div>
          </div>

          {/* Primary CTA - low friction */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Takes less than 90 seconds</span>
            </div>
            
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-xl px-12 py-8 shadow-2xl hover:scale-[1.02] transition-all duration-300"
              onClick={handleGetStarted}
            >
              GET STARTED — FREE
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>100% free assessment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Problem > Solution Section */}
        <div className="max-w-4xl mx-auto mt-20 animate-fade-in">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-border/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Terminology is confusing. Deadlines are strict. Mistakes cost you.
              </h2>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg text-muted-foreground">
                <strong className="text-foreground">Most people lose or delay cases</strong> because they don't know what forms to file or which tribunal to approach.
              </p>
              <p className="text-lg text-muted-foreground">
                Justice-Bot tells you <strong className="text-foreground">exactly what matters</strong> for your legal situation — step by step.
              </p>
              <p className="text-lg text-primary font-semibold">
                No lawyer fee. No complex legal jargon.
              </p>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              className="group border-2 border-primary hover:bg-primary hover:text-primary-foreground"
              onClick={handleGetStarted}
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
