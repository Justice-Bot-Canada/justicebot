import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Users, Clock, Sparkles, Star } from "lucide-react";
import { trackEvent, analytics } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTrialClick = () => {
    trackEvent('cta_click', { button: 'hero_trial', location: 'hero' });
    analytics.viewItem('professional', 'Professional', 29);
    navigate('/pricing');
  };

  const handleTriageClick = () => {
    trackEvent('cta_click', { button: 'hero_triage', location: 'hero' });
    navigate('/triage');
  };

  return (
    <section 
      className="relative min-h-[85vh] bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden" 
      aria-labelledby="hero-heading" 
      role="banner"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
        {/* Social proof bar - immediately visible */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 animate-fade-in">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold">10,000+</span>
            <span className="text-muted-foreground">Canadians helped</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm ml-1 font-semibold">4.8/5</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Average case prep:</span>
            <span className="font-semibold">15 min</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 rounded-full px-4 py-2 animate-fade-in">
                <Sparkles className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">🎉 Try FREE for 5 Days — No Credit Card</span>
              </div>
              
              <h1 
                id="hero-heading" 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in" 
                role="heading" 
                aria-level={1}
              >
                <span className="text-foreground">Fight Back.</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Know Your Rights.
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg animate-fade-in">
                AI-powered legal tools for tenants, workers, and families 
                <strong className="text-foreground"> across Canada</strong>.
                Court forms from <strong className="text-primary">$5.99</strong>.
              </p>
            </div>

            {/* Value preview box */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-5 border border-primary/20 shadow-lg animate-fade-in">
              <h2 className="text-sm font-bold mb-3 text-primary flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                In 2 minutes, you'll know:
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span className="text-foreground">Which venue handles your case (LTB, HRTO, Small Claims)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span className="text-foreground">Exactly which forms you need to file</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span className="text-foreground">Your next 3 steps — in plain English</span>
                </li>
              </ul>
            </div>

            {/* Dual CTAs */}
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="cta" 
                  size="lg" 
                  className="group text-lg px-8 py-6 shadow-xl flex-1"
                  onClick={handleTriageClick}
                  aria-describedby="cta-description"
                >
                  Get Free Case Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group text-lg px-8 py-6 border-2 border-primary/50 hover:bg-primary hover:text-primary-foreground flex-1"
                  onClick={handleTrialClick}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start 5-Day Free Trial
                </Button>
              </div>
              
              <span id="cta-description" className="sr-only">
                Start with a free assessment of your legal situation
              </span>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>No signup required for assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Cancel trial anytime</span>
                </div>
              </div>
            </div>

            {/* Nationwide badge */}
            <div className="pt-4 border-t border-border/50 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🇨🇦</span>
                <span className="text-sm font-semibold text-foreground">Nationwide Coverage</span>
                <span className="text-xs text-muted-foreground">• All 10 provinces + 3 territories</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Forms & procedures for ON, BC, AB, QC, MB, SK, NS, NB, NL, PE, YT, NT, NU
              </p>
            </div>
          </div>

          <div className="relative" role="img" aria-labelledby="hero-image-desc">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl" aria-hidden="true" />
            <picture className="relative block rounded-2xl shadow-2xl w-full max-w-lg mx-auto">
              <source media="(min-width: 768px)" srcSet="/hero-desktop.webp" type="image/webp" />
              <img 
                src="/hero-mobile.webp" 
                alt="Modern courthouse with classical columns and steps, representing legal clarity and justice" 
                className="rounded-2xl w-full h-auto" 
                loading="eager" 
                fetchPriority="high" 
                width={800} 
                height={450} 
                decoding="async" 
              />
            </picture>
            <p id="hero-image-desc" className="sr-only">
              A modern courthouse building symbolizing the bridge between traditional legal processes and modern digital assistance
            </p>
            
            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-4 bg-card border shadow-xl rounded-xl p-4 animate-fade-in hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-bold text-lg">89%</p>
                  <p className="text-xs text-muted-foreground">Cases resolved favorably</p>
                </div>
              </div>
            </div>

            {/* Disclaimer - minimal */}
            <div className="mt-6 text-xs text-muted-foreground text-center max-w-md mx-auto" role="note">
              Justice-Bot provides legal information, not legal advice. We help you prepare and understand your options.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;