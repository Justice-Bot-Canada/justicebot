import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/utils/analytics";

const COUNTRY_SELECTED_KEY = "justicebot_country_selected";

export const CountrySelector = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already selected a country (first-visit only)
    const hasSelected = localStorage.getItem(COUNTRY_SELECTED_KEY);
    if (!hasSelected) {
      setOpen(true);
    }
  }, []);

  const handleCountrySelect = useCallback((country: "CA" | "US") => {
    // Store selection in localStorage
    localStorage.setItem(COUNTRY_SELECTED_KEY, country);
    
    // Fire GA4 analytics event
    trackEvent("country_selected", { country });
    
    setOpen(false);

    if (country === "US") {
      // Redirect to USA site
      window.location.href = "https://justicebot-usa.com";
    }
    // Canada stays on current site
  }, []);

  // Prevent closing without selection for first-time visitors
  const handleOpenChange = useCallback((newOpen: boolean) => {
    // Only allow closing if a country has been selected
    const hasSelected = localStorage.getItem(COUNTRY_SELECTED_KEY);
    if (hasSelected || !newOpen) {
      setOpen(newOpen);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Justice-Bot
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Select your country to ensure you see information specific to your legal system.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center py-6"
          role="group"
          aria-label="Country selection"
        >
          {/* Canada Option */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-3 h-auto py-6 px-8 hover:bg-primary/5 hover:border-primary transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => handleCountrySelect("CA")}
            aria-label="Select Canada - Legal information for Canadian jurisdictions"
          >
            <span className="text-6xl" aria-hidden="true">
              🇨🇦
            </span>
            <span className="font-semibold text-lg">Canada</span>
            <span className="text-xs text-muted-foreground">justice-bot.com</span>
          </Button>

          {/* USA Option */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-3 h-auto py-6 px-8 hover:bg-primary/5 hover:border-primary transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => handleCountrySelect("US")}
            aria-label="Select United States - Legal information for US jurisdictions"
          >
            <span className="text-6xl" aria-hidden="true">
              🇺🇸
            </span>
            <span className="font-semibold text-lg">United States</span>
            <span className="text-xs text-muted-foreground">justicebot-usa.com</span>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground" aria-live="polite">
          Legal information and procedures are specific to each country's laws. 
          Your selection will be remembered for future visits.
        </p>
      </DialogContent>
    </Dialog>
  );
};
