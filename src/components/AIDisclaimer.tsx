import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AIDisclaimerProps {
  className?: string;
  variant?: "default" | "compact";
}

export const AIDisclaimer = ({ className = "", variant = "default" }: AIDisclaimerProps) => {
  if (variant === "compact") {
    return (
      <p className={`text-xs text-muted-foreground ${className}`}>
        ⚠️ Information only, not legal advice. Not a law firm. Ontario-focused guidance.
      </p>
    );
  }

  return (
    <Alert className={`border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
      <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
        <strong>Not Legal Advice:</strong> Justice-Bot provides general information and guidance only. 
        We are not a law firm and do not provide legal advice. Information is focused on Ontario law. 
        For specific legal advice, consult a qualified lawyer licensed in your jurisdiction.
      </AlertDescription>
    </Alert>
  );
};
