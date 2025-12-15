import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-2">
                <span className="text-sm font-semibold text-primary">🇨🇦 Now Serving Ontario, Alberta, BC & Quebec</span>
              </div>
              <h1 
                id="hero-heading" 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                role="heading"
                aria-level={1}
              >
                <span className="text-foreground">Affordable Legal Help</span>
                <br />
                <span className="text-primary">Across Canada</span>
              </h1>
              <p className="text-lg font-semibold text-foreground max-w-lg mb-2">
                Free plain-language legal help for Ontario tenants, families & human rights issues.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Self-represented? We help you navigate tribunals and courts with confidence—step by step.
              </p>
              
              {/* What You'll Get Box */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-primary/20 mt-4">
                <h2 className="text-sm font-bold mb-3 text-center">What You'll Get:</h2>
                <div className="grid grid-cols-2 gap-3 text-left text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">Court-ready PDFs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">Step-by-step guides</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">Timeline tracker</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">24/7 AI assistant</span>
                  </div>
                </div>
              </div>
            </div>

            <ul className="space-y-3" role="list" aria-label="Key features">
              {[
                "Smart triage to the right venue",
                "Auto-filled legal forms", 
                "Merit score & reality check",
                "Plain-language explanations"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3" role="listitem">
                  <CheckCircle 
                    className="w-5 h-5 text-success flex-shrink-0" 
                    aria-hidden="true"
                  />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Pricing CTA Block */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-6 border-2 border-primary/30 shadow-lg">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-bold animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  LAUNCH SPECIAL
                </Badge>
                <Badge variant="outline" className="border-primary text-primary">
                  Use code: LAUNCH50
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">$2.99</span>
                    <span className="text-lg text-muted-foreground line-through">$5.99</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">First month 50% off with code LAUNCH50</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4" role="group" aria-label="Main actions">
                <Button 
                  variant="cta" 
                  size="lg" 
                  className="group text-lg px-8 py-6 shadow-xl"
                  onClick={() => window.location.href = '/pricing'}
                  aria-describedby="cta-description"
                >
                  Get Started Now
                  <ArrowRight 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    aria-hidden="true"
                  />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-6 py-6"
                  onClick={() => window.location.href = '/triage'}
                >
                  Try Free Assessment
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>7-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
              </div>
              <span id="cta-description" className="sr-only">
                Begin your legal case with our premium plan
              </span>
            </div>

            <div 
              className="bg-warning/10 border border-warning/20 rounded-lg p-4"
              role="note"
              aria-labelledby="disclaimer-heading"
            >
              <p className="text-sm text-foreground">
                <strong id="disclaimer-heading">Disclaimer:</strong> Justice-Bot isn't a law firm and doesn't provide legal advice. 
                It's a tool to help you prepare, file, and understand your options.
              </p>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;