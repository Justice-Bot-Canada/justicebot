import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, CheckCircle } from "lucide-react";
import { submitLead } from "@/api/leads";
import { toast } from "sonner";
import { trackEvent } from "@/utils/analytics";

const StickyLeadCapture = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed or submitted
    const dismissed = localStorage.getItem('sticky_lead_dismissed');
    const submitted = localStorage.getItem('sticky_lead_submitted');
    
    if (dismissed || submitted) {
      setIsDismissed(true);
      return;
    }

    // Show after 15 seconds on page
    const timer = setTimeout(() => {
      setIsVisible(true);
      trackEvent('sticky_lead_shown', {});
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({
        email,
        source: 'sticky_bottom_bar',
        payload: { intent: 'legal_updates' }
      });
      setIsSubmitted(true);
      localStorage.setItem('sticky_lead_submitted', 'true');
      trackEvent('sticky_lead_captured', { email_captured: true });
      toast.success("You're on the list!");
      
      // Hide after 2 seconds
      setTimeout(() => setIsVisible(false), 2000);
    } catch (error) {
      toast.error("Failed to save. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('sticky_lead_dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg animate-slide-up">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {isSubmitted ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Thanks! Check your inbox.</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium">Get free legal tips for your situation</span>
              </div>
              
              <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full sm:w-64"
                  required
                />
                <Button 
                  type="submit" 
                  size="sm"
                  className="h-10 whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "..." : "Get tips"}
                </Button>
              </form>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyLeadCapture;
