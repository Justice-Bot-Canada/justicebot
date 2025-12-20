import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import { trackEvent } from "@/utils/analytics";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-[80vh] bg-gradient-to-br from-background via-trust-light/5 to-background"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Trust block - immediately visible */}
            <div className="bg-muted/50 border border-border/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Not a lawyer. Not filing for you.</strong>
                <br />
                Justice-Bot helps you understand your options and prepare — you decide what to do next.
              </p>
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
                <span className="text-sm font-semibold text-primary">🇨🇦 Ontario, Alberta, BC & Quebec</span>
              </div>
              <h1 
                id="hero-heading" 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                role="heading"
                aria-level={1}
              >
                <span className="text-foreground">Ignorance Is Not an Option.</span>
                <br />
                <span className="text-primary">Your Rights Should Not Be Either.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Built for self-represented Canadians navigating tribunals and courts. 
                We help you know what to expect and what steps to take next.
              </p>
            </div>

            {/* Preview value - what you'll learn before signing up */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-5 border border-primary/20">
              <h2 className="text-sm font-bold mb-3 text-primary">In 2 minutes, you'll know:</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-foreground">Which venue handles your situation (LTB, HRTO, Small Claims, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-foreground">What forms people in your situation typically file</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-foreground">Your likely next 3 steps — in plain language</span>
                </li>
              </ul>
            </div>

            {/* Single dominant CTA */}
            <div className="space-y-4">
              <Button 
                variant="cta" 
                size="lg" 
                className="group text-lg px-10 py-7 shadow-xl w-full sm:w-auto"
                onClick={() => {
                  trackEvent('cta_click', { button: 'hero_triage', location: 'hero' });
                  window.location.href = '/triage';
                }}
                aria-describedby="cta-description"
              >
                Get a Free Case Overview
                <ArrowRight 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  aria-hidden="true"
                />
              </Button>
              <span id="cta-description" className="sr-only">
                Start with a free assessment of your legal situation
              </span>
              
              {/* Reassurance about no commitment */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-success" />
                <span>No signup required. Nothing charged or filed without your say-so.</span>
              </div>
            </div>

            {/* Secondary links - much less prominent */}
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Already know what you need?</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <a 
                  href="/forms" 
                  className="text-primary hover:underline"
                >
                  Browse forms →
                </a>
                <a 
                  href="/pricing" 
                  className="text-primary hover:underline"
                >
                  View pricing →
                </a>
                <a 
                  href="/legal-chat" 
                  className="text-primary hover:underline"
                >
                  Ask a question →
                </a>
              </div>
            </div>
          </div>

          <div className="relative" role="img" aria-labelledby="hero-image-desc">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl" aria-hidden="true"></div>
            <picture className="relative block rounded-2xl shadow-2xl w-full max-w-lg mx-auto">
              <source 
                media="(min-width: 768px)" 
                srcSet="/hero-desktop.webp" 
                type="image/webp"
              />
              <img 
                src="/hero-mobile.webp" 
                alt="Modern courthouse with classical columns and steps, representing legal clarity and justice in the digital age"
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
            
            {/* Disclaimer moved below image, less prominent */}
            <div 
              className="mt-4 text-xs text-muted-foreground text-center max-w-md mx-auto"
              role="note"
            >
              Justice-Bot is a legal information tool, not a law firm. We help you prepare and understand your options.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
