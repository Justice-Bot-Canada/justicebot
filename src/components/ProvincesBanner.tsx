import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ProvincesBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                🇨🇦 Expanding Across Canada
              </p>
              <p className="text-sm text-muted-foreground">
                British Columbia, Alberta, and Quebec forms coming soon! Currently serving Ontario.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDismissed(true)}
              className="text-muted-foreground"
            >
              Dismiss
            </Button>
            <Button 
              size="sm"
              onClick={() => window.open('mailto:expand@justice-bot.com?subject=Province Request', '_blank')}
              className="gap-2"
            >
              Request Your Province
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProvincesBanner;
