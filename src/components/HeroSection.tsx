import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import heroImage from "@/assets/justice-hero.jpg";

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
              <h1 
                id="hero-heading" 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                role="heading"
                aria-level={1}
              >
                <span className="text-foreground">Legal clarity</span>
                <br />
                <span className="text-primary">without the noise</span>
              </h1>
              <p className="text-lg font-semibold text-foreground max-w-lg mb-2">
                Free plain-language legal help for Ontario tenants, families & human rights issues.
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Describe your legal situation in plain language and get smart guidance, 
                auto-filled forms, and step-by-step help navigating Ontario's courts and tribunals.
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground text-sm mt-4">
                "Everyone has the right to life, liberty and security of the person and the right not to be deprived thereof except in accordance with the principles of fundamental justice." — Charter of Rights and Freedoms, Section 7
              </blockquote>
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

            <div className="flex flex-col items-center sm:items-start gap-4" role="group" aria-label="Main actions">
              <Button 
                variant="cta" 
                size="lg" 
                className="group w-full sm:w-auto text-lg px-8 py-6"
                onClick={() => window.location.href = '/triage'}
                aria-describedby="cta-description"
              >
                Start Your Case
                <ArrowRight 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  aria-hidden="true"
                />
                <span id="cta-description" className="sr-only">
                  Begin your legal case assessment process
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => {
                  const videoSection = document.querySelector('[id*="explainer"]') || document.getElementById('merit');
                  videoSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                aria-describedby="demo-description"
              >
                Watch How It Works (60 sec)
                <span id="demo-description" className="sr-only">
                  View demonstration of Justice-Bot features and merit scoring system
                </span>
              </Button>
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
            <LazyImage 
              src={heroImage} 
              alt="Modern courthouse with classical columns and steps, representing legal clarity and justice in the digital age"
              className="relative rounded-2xl shadow-2xl w-full h-auto max-w-lg mx-auto"
              loading="eager"
              width={512}
              height={384}
            />
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