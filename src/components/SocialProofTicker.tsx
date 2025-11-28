import { useEffect, useState } from 'react';
import { Users, X } from 'lucide-react';

const PROOF_MESSAGES = [
  { name: "Sarah from Toronto", action: "just started their LTB case" },
  { name: "Michael from Ottawa", action: "downloaded a legal form" },
  { name: "Jessica from Mississauga", action: "got their case assessment" },
  { name: "David from Hamilton", action: "filed their small claims application" },
  { name: "Emily from London", action: "just subscribed to Premium" },
  { name: "James from Brampton", action: "completed their HRTO complaint" },
  { name: "Lisa from Markham", action: "got their legal document drafted" },
  { name: "Robert from Windsor", action: "started their case timeline" },
  { name: "Jennifer from Kitchener", action: "uploaded evidence to their case" },
  { name: "Daniel from Vaughan", action: "received their merit score" }
];

export function SocialProofTicker() {
  const [isVisible, setIsVisible] = useState(false);
  const [message] = useState(() => {
    // Pick a random message once on mount
    return PROOF_MESSAGES[Math.floor(Math.random() * PROOF_MESSAGES.length)];
  });

  useEffect(() => {
    // Show notification after 5 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Hide notification after 13 seconds (5s delay + 8s visible)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 13000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-24 left-6 z-40 max-w-sm transition-all duration-500 animate-in slide-in-from-left"
    >
      <div className="bg-card border border-border shadow-lg rounded-lg p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {message.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {message.action}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Just now
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
