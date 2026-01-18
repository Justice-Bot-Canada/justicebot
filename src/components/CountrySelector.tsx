import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const COUNTRY_SELECTED_KEY = "justicebot_country_selected";

export const CountrySelector = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already selected a country
    const hasSelected = localStorage.getItem(COUNTRY_SELECTED_KEY);
    if (!hasSelected) {
      setOpen(true);
    }
  }, []);

  const handleCanadaSelect = () => {
    localStorage.setItem(COUNTRY_SELECTED_KEY, "CA");
    setOpen(false);
    // Stay on current site (Canada)
  };

  const handleUSASelect = () => {
    localStorage.setItem(COUNTRY_SELECTED_KEY, "US");
    setOpen(false);
    // Redirect to USA site
    window.location.href = "https://justicebot-usa.com";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Justice-Bot
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Please select your country to continue
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center py-6">
          {/* Canada Option */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-3 h-auto py-6 px-8 hover:bg-primary/5 hover:border-primary transition-all"
            onClick={handleCanadaSelect}
          >
            <span className="text-6xl" role="img" aria-label="Canadian flag">
              🇨🇦
            </span>
            <span className="font-semibold text-lg">Canada</span>
            <span className="text-xs text-muted-foreground">justice-bot.com</span>
          </Button>

          {/* USA Option */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-3 h-auto py-6 px-8 hover:bg-primary/5 hover:border-primary transition-all"
            onClick={handleUSASelect}
          >
            <span className="text-6xl" role="img" aria-label="American flag">
              🇺🇸
            </span>
            <span className="font-semibold text-lg">United States</span>
            <span className="text-xs text-muted-foreground">justicebot-usa.com</span>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Legal information and tools are specific to each country's laws and procedures.
        </p>
      </DialogContent>
    </Dialog>
  );
};
