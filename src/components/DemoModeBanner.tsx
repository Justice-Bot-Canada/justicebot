import { useDemoMode } from "@/hooks/useDemoMode";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Banner displayed at the top of the page when in demo mode
 */
const DemoModeBanner = () => {
  const { isDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            You're viewing the demo version of Justice-Bot
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white text-amber-950 border-amber-700"
          onClick={() => window.open("https://justice-bot.com", "_blank")}
        >
          Go to Full Version
          <ExternalLink className="ml-2 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default DemoModeBanner;
