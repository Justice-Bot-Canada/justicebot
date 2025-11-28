import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function UrgencyTimer() {
  const [spotsLeft, setSpotsLeft] = useState(0);

  useEffect(() => {
    // Generate a realistic "spots left" number between 3-12
    // Use date to make it consistent for the day
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const spots = 3 + (seed % 10);
    setSpotsLeft(spots);
  }, []);

  return (
    <Alert className="bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <AlertDescription className="font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Limited spots available this month - Only {spotsLeft} spots left for new cases
        </AlertDescription>
      </div>
    </Alert>
  );
}
