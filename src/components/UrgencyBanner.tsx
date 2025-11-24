import { Clock, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UrgencyBannerProps {
  deadline?: string;
  daysLeft?: number;
}

export function UrgencyBanner({ deadline, daysLeft }: UrgencyBannerProps) {
  if (!deadline && !daysLeft) return null;

  const urgencyLevel = daysLeft 
    ? daysLeft <= 3 ? "critical" : daysLeft <= 7 ? "high" : "medium"
    : "medium";

  const colors = {
    critical: "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:text-red-100",
    high: "bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100",
    medium: "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100"
  };

  return (
    <Alert className={`${colors[urgencyLevel]} mb-6 animate-pulse-subtle`}>
      <div className="flex items-center gap-3">
        {urgencyLevel === "critical" ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <Clock className="h-5 w-5" />
        )}
        <AlertDescription className="font-semibold">
          {daysLeft !== undefined && daysLeft <= 3 && (
            <span className="text-red-600 dark:text-red-400">
              ⚠️ URGENT: Only {daysLeft} days left to file!
            </span>
          )}
          {daysLeft !== undefined && daysLeft > 3 && daysLeft <= 7 && (
            <span>
              Time-sensitive: {daysLeft} days remaining to submit your forms
            </span>
          )}
          {deadline && (
            <span>
              Deadline: {new Date(deadline).toLocaleDateString('en-CA')} - Don't miss your filing window
            </span>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}
