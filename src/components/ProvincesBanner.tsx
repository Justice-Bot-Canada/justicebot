import { MapPin, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function ProvincesBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const wasDismissed = sessionStorage.getItem('provinces-banner-dismissed');
    if (!wasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('provinces-banner-dismissed', 'true');
  };

  if (dismissed || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-background dark:to-red-950/20 border-b border-red-100 dark:border-red-900/30 relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇨🇦</span>
            <span className="font-medium text-foreground">
              Now Serving 4 Provinces!
            </span>
            <span className="hidden sm:inline text-muted-foreground">—</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Available in <span className="font-medium text-primary">Ontario</span>, <span className="font-medium text-primary">Alberta</span>, <span className="font-medium text-primary">BC</span> & <span className="font-medium text-primary">Quebec</span>
          </p>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => window.open('mailto:expand@justice-bot.com?subject=Province Request', '_blank')}
            className="text-primary hover:text-primary/80 gap-1 px-2"
          >
            Request your province
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ProvincesBanner;
