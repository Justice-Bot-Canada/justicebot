import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Users, Clock, Sparkles, Star, Zap } from "lucide-react";
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
      className="relative min-h-[90vh] bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden" 
      aria-labelledby="hero-heading" 
      role="banner"
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-success/10 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        {/* Social proof bar - premium styling */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-10 animate-fade-in">
          <div className="flex items-center gap-2 text-sm bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">10,000+</span>
            <span className="text-muted-foreground">Canadians helped</span>
          </div>
          <div className="flex items-center gap-1 bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm ml-2 font-bold text-foreground">4.8/5</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-card/60 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
            <Zap className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Avg prep:</span>
            <span className="font-bold text-foreground">15 min</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-success/20 to-success/10 border border-success/40 rounded-full px-5 py-2.5 animate-fade-in shadow-sm">
                <Sparkles className="w-4 h-4 text-success animate-pulse" />
                <span className="text-sm font-bold text-success">🎉 Try FREE for 5 Days — No Credit Card</span>
              </div>
              
              <h1 
                id="hero-heading" 
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight animate-fade-in" 
                role="heading" 
                aria-level={1}
              >
                <span className="text-foreground">Fight Back.</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                  Know Your Rights.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl animate-fade-in">
                AI-powered legal tools for tenants, workers & families 
                <strong className="text-foreground"> across Canada</strong>.
                <br />
                <span className="text-lg">Court forms from <strong className="text-primary text-xl">$5.99</strong></span>
              </p>
            </div>

            {/* Value preview box - enhanced */}
            <div className="bg-card/90 backdrop-blur-md rounded-2xl p-6 border-2 border-primary/20 shadow-xl animate-fade-in">
              <h2 className="text-sm font-bold mb-4 text-primary flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                In 2 minutes, you'll know:
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-success to-success/80 text-success-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">1</span>
                  <span className="text-foreground">Which venue handles your case (LTB, HRTO, Small Claims)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-success to-success/80 text-success-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">2</span>
                  <span className="text-foreground">Exactly which forms you need to file</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-success to-success/80 text-success-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">3</span>
                  <span className="text-foreground">Your next 3 steps — in plain English</span>
                </li>
              </ul>
            </div>

            {/* Dual CTAs - enhanced */}
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="cta" 
                  size="lg" 
                  className="group text-lg px-10 py-7 shadow-2xl flex-1 hover:scale-[1.02] transition-all duration-300"
                  onClick={handleTriageClick}
                  aria-describedby="cta-description"
                >
                  Get Free Case Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group text-lg px-10 py-7 border-2 border-primary/40 hover:bg-primary hover:text-primary-foreground flex-1 hover:scale-[1.02] transition-all duration-300"
                  onClick={handleTrialClick}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start 5-Day Free Trial
                </Button>
              </div>
              
              <span id="cta-description" className="sr-only">
                Start with a free assessment of your legal situation
              </span>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Cancel trial anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-success" />
                  <span>Results in 2 min</span>
                </div>
              </div>
            </div>

            {/* Nationwide badge - enhanced */}
            <div className="pt-5 border-t border-border/50 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🇨🇦</span>
                <span className="text-sm font-bold text-foreground">Nationwide Coverage</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">All 13 jurisdictions</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Forms & procedures for ON, BC, AB, QC, MB, SK, NS, NB, NL, PE, YT, NT, NU
              </p>
            </div>
          </div>

          <div className="relative" role="img" aria-labelledby="hero-image-desc">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/20 rounded-3xl blur-3xl" aria-hidden="true" />
            <picture className="relative block rounded-3xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden border-4 border-card/50">
              <source media="(min-width: 768px)" srcSet="/hero-desktop.webp" type="image/webp" />
              <img 
                src="/hero-mobile.webp" 
                alt="Modern courthouse with classical columns and steps, representing legal clarity and justice" 
                className="rounded-2xl w-full h-auto hover:scale-105 transition-transform duration-700" 
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
            
            {/* Floating stats card - enhanced */}
            <div className="absolute -bottom-6 -left-6 bg-card border-2 border-border shadow-2xl rounded-2xl p-5 animate-fade-in hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-success-foreground" />
                </div>
                <div>
                  <p className="font-extrabold text-2xl text-foreground">89%</p>
                  <p className="text-xs text-muted-foreground">Cases resolved favorably</p>
                </div>
              </div>
            </div>

            {/* Disclaimer - minimal */}
            <div className="mt-8 text-xs text-muted-foreground text-center max-w-md mx-auto bg-muted/50 rounded-lg px-4 py-2" role="note">
              Justice-Bot provides legal information, not legal advice. We help you prepare and understand your options.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;