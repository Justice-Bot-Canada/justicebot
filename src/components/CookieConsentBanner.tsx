import { useConsent } from '@/hooks/useConsent';
import { Button } from '@/components/ui/button';
import { Shield, Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function CookieConsentBanner() {
  const { consent, acceptConsent, declineConsent } = useConsent();
  const [isMinimized, setIsMinimized] = useState(false);

  // Don't show if consent already given or declined
  if (consent !== 'pending') {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open cookie preferences"
      >
        <Cookie className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Shield className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Your Privacy Matters</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use analytics to improve your experience. This includes page views, 
                session data, and usage patterns. No personal legal information is tracked. 
                You can change your preference anytime in{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Settings
                </Link>.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={declineConsent}
              className="flex-1 sm:flex-initial"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={acceptConsent}
              className="flex-1 sm:flex-initial"
            >
              Accept Analytics
            </Button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors sm:hidden"
              aria-label="Minimize"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
