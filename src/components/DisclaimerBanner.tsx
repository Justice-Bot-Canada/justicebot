import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DisclaimerBanner = () => {
  return (
    <Alert className="bg-warning/10 border-warning/30 mb-6">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertDescription className="text-sm">
        <strong>Not Legal Advice:</strong> Justice-Bot is not a law firm and doesn't provide legal advice. This is a self-help tool. Results depend on your specific facts and how you present your case. Complex matters may require a licensed lawyer or paralegal.
      </AlertDescription>
    </Alert>
  );
};
