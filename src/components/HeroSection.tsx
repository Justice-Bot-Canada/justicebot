import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap } from "lucide-react";
import { trackEvent, analytics } from "@/utils/analytics";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const HeroSection = () => {
  const navigate = useNavigate();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleStart = () => {
    trackEvent('funnel_start', { location: 'hero' });
    // Fire GA4 funnel_start event for purchase funnel
    analytics.funnelStart(window.location.pathname);
    navigate('/funnel');
  };

  const handlePaidHelp = async () => {
    setIsCheckoutLoading(true);
    trackEvent('cta_click', { button: 'paid_help_599', location: 'hero' });
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          priceId: 'price_1SYLdJL0pLShFbLttpxYfuas',
          mode: 'payment',
          successUrl: `${window.location.origin}/payment-success?type=form_unlock`,
          cancelUrl: `${window.location.origin}/`,
          metadata: { product: 'emergency_form_unlock', source: 'hero_cta' }
        }
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Unable to start checkout. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleHowItWorks = () => {
    trackEvent('cta_click', { button: 'how_it_works', location: 'hero' });
    // Scroll to trust section or open modal
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
          
          {/* Clear headline */}
          <div className="space-y-6 animate-fade-in">
            <h1 
              id="hero-heading" 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground"
            >
              Get the right legal help for your situation — step by step
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              We guide you to the correct forms, courts, and next steps. No guesswork.
            </p>
          </div>

          {/* Primary CTA - big and dominant */}
          <div className="space-y-4 animate-fade-in pt-6">
            <Button 
              variant="cta" 
              size="lg" 
              className="group text-xl md:text-2xl px-12 py-8 md:py-10 shadow-2xl hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
              onClick={handleStart}
            >
              Start — it takes 2 minutes
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Paid Help CTA */}
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
                onClick={handlePaidHelp}
                disabled={isCheckoutLoading}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isCheckoutLoading ? 'Loading...' : 'Get Help Now ($5.99)'}
              </Button>
            </div>
            
            {/* Secondary CTA */}
            <div>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;