import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RateLimitNoticeProps {
  resetTime?: number;
}

export const RateLimitNotice = ({ resetTime }: RateLimitNoticeProps) => {
  const timeRemaining = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
  
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Rate Limit Exceeded</AlertTitle>
      <AlertDescription>
        You've made too many requests. Please wait {timeRemaining} seconds before trying again.
        This helps us maintain service quality for all users.
      </AlertDescription>
    </Alert>
  );
};
