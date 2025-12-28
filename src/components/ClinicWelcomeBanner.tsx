import { useEffect, useState } from 'react';
import { isClinicTraffic, getClinicDisplayName, getCurrentUTMParams } from '@/utils/utmTracking';
import { analytics } from '@/utils/analytics';
import { Building2, X } from 'lucide-react';

const ClinicWelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [clinicName, setClinicName] = useState<string | null>(null);

  useEffect(() => {
    // Check if visitor is from a clinic
    if (isClinicTraffic()) {
      const displayName = getClinicDisplayName();
      setClinicName(displayName);
      setIsVisible(true);
      
      // Fire clinic visitor arrived event
      analytics.clinicVisitorArrived();
    }
  }, []);

  if (!isVisible || !clinicName) {
    return null;
  }

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-medium">Welcome, {clinicName} Community Members!</span>
              <span className="hidden sm:inline text-muted-foreground ml-2">
                We're here to help you navigate your legal matter.
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss welcome banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicWelcomeBanner;
