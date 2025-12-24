import { AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CrossTribunalBannerProps {
  currentTribunal: "ltb" | "hrto" | "small-claims" | "family" | "labour" | "criminal";
}

const tribunalMessages: Record<string, { message: string; relatedPath: string; relatedName: string }[]> = {
  ltb: [
    { 
      message: "If discrimination or reprisal based on disability, race, or other protected grounds is involved", 
      relatedPath: "/hrto-journey", 
      relatedName: "HRTO" 
    }
  ],
  hrto: [
    { 
      message: "If this occurred in housing, you may also have claims at the", 
      relatedPath: "/ltb-journey", 
      relatedName: "LTB" 
    },
    { 
      message: "If this occurred at work, you may also have claims at the", 
      relatedPath: "/labour-board-journey", 
      relatedName: "Labour Board" 
    }
  ],
  "small-claims": [
    { 
      message: "If this involves landlord-tenant issues", 
      relatedPath: "/ltb-journey", 
      relatedName: "LTB" 
    }
  ],
  family: [
    { 
      message: "If Children's Aid Society is involved", 
      relatedPath: "/cas-journey", 
      relatedName: "CAS Journey" 
    }
  ],
  labour: [
    { 
      message: "If workplace discrimination based on protected grounds is involved", 
      relatedPath: "/hrto-journey", 
      relatedName: "HRTO" 
    }
  ],
  criminal: [
    { 
      message: "If police misconduct occurred during your case", 
      relatedPath: "/police-accountability-journey", 
      relatedName: "Police Accountability" 
    }
  ]
};

export const CrossTribunalBanner = ({ currentTribunal }: CrossTribunalBannerProps) => {
  const navigate = useNavigate();
  const messages = tribunalMessages[currentTribunal] || [];

  if (messages.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-2">
            You may have multiple legal pathways
          </h4>
          <div className="space-y-2">
            {messages.map((item, index) => (
              <div key={index} className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">
                  {item.message}, the <strong>{item.relatedName}</strong> may also apply.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(item.relatedPath)}
                  className="text-xs"
                >
                  Explore {item.relatedName}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Justice-Bot will help identify all applicable claims as you proceed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrossTribunalBanner;
