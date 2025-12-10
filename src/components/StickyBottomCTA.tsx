import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, Shield, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export const StickyBottomCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem("sticky-cta-dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show after scrolling 300px
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("sticky-cta-dismissed", "true");
  };

  const handleApplyPromo = () => {
    const validCodes = ["LAUNCH50", "FIRST50", "DEMO2024"];
    if (validCodes.includes(promoCode.toUpperCase())) {
      setPromoApplied(true);
      localStorage.setItem("promo-code", promoCode.toUpperCase());
    }
  };

  const handleStartCase = () => {
    // Store promo if applied
    if (promoApplied) {
      localStorage.setItem("promo-code", promoCode.toUpperCase());
    }
    window.location.href = "/pricing";
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary to-accent shadow-2xl border-t border-primary-foreground/20 animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left - Value Prop */}
          <div className="flex items-center gap-3 text-primary-foreground">
            <Shield className="w-6 h-6 flex-shrink-0" />
            <div className="text-center md:text-left">
              <p className="font-bold text-sm md:text-base">
                Start Your Case Today - 7-Day Money Back Guarantee
              </p>
              <p className="text-xs md:text-sm opacity-90">
                Only $5.99/mo • Cancel anytime • Court-ready forms in minutes
              </p>
            </div>
          </div>

          {/* Middle - Promo Code */}
          <div className="flex items-center gap-2">
            {!promoApplied ? (
              <>
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-28 h-9 text-sm bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApplyPromo}
                  className="h-9 bg-transparent border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  Apply
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-green-300" />
                <span className="text-sm font-bold text-green-300">50% OFF Applied!</span>
              </div>
            )}
          </div>

          {/* Right - CTA */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleStartCase}
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold group"
            >
              {promoApplied ? "Get 50% Off Now" : "Get Started"}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button
              onClick={handleDismiss}
              className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyBottomCTA;
