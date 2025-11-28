import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Rotate through messages every 8 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PROOF_MESSAGES.length);
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const currentMessage = PROOF_MESSAGES[currentIndex];

  return (
    <div
      className={`fixed bottom-24 left-6 z-40 max-w-sm transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="bg-card border border-border shadow-lg rounded-lg p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {currentMessage.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentMessage.action}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Just now
          </p>
        </div>
      </div>
    </div>
  );
}
