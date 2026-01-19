import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { trackEvent, analytics } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";
import canadaFlagHero from "@/assets/canada-flag-hero.png";

/**
 * SimplifiedHero - Single Promise Landing
 * 
 * ONE message: Upload your document → Get plain language explanation → Next step
 * No mention of: Merit engines, AI architecture, multiple jurisdictions, platform capabilities
 */
const SimplifiedHero = () => {
  const navigate = useNavigate();

  const handleUploadDocument = () => {
    trackEvent('cta_click', { button: 'upload_document', location: 'hero_simplified' });
    analytics.funnelStart(window.location.pathname);
    navigate('/upload');
  };

  return (
    <section 
      className="relative min-h-[60vh] sm:min-h-[70vh] overflow-hidden flex items-center" 
      aria-labelledby="hero-heading" 
      role="banner"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img 
          src={canadaFlagHero}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          
          {/* Single Clear Promise */}
          <div className="space-y-4 animate-fade-in">
            <h1 
              id="hero-heading" 
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white"
            >
              Upload your legal document.
              <br />
              <span className="text-primary">We explain it in plain language.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 max-w-lg mx-auto">
              Get your recommended forms and next steps in minutes.
            </p>
          </div>

          {/* Single Primary CTA */}
          <div className="space-y-4 animate-fade-in">
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-lg sm:text-xl px-10 py-6 sm:py-8 shadow-2xl hover:scale-[1.02] transition-all duration-300"
              onClick={handleUploadDocument}
            >
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-3" aria-hidden="true" />
              Start with my document
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>

            {/* Trust micro-copy - minimal */}
            <p className="text-sm text-white/60 flex items-center justify-center gap-4">
              <span>✓ Free to start</span>
              <span>✓ No signup required</span>
            </p>
          </div>

          {/* Simple 3-step process */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl mb-1">1</div>
              <p className="text-sm text-white/70">Upload document</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">2</div>
              <p className="text-sm text-white/70">Get explanation</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">3</div>
              <p className="text-sm text-white/70">See next steps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimplifiedHero;
