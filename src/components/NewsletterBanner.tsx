import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail } from 'lucide-react';
import { submitLead } from '@/api/leads';
import { useToast } from '@/hooks/use-toast';

export function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletter_banner_dismissed');
    const submitted = localStorage.getItem('lead_submitted');
    
    if (!dismissed && !submitted) {
      // Show banner after 10 seconds
      const timer = setTimeout(() => setIsVisible(true), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitLead({
        email,
        source: 'newsletter_banner',
        journey: 'newsletter',
      });

      localStorage.setItem('lead_submitted', Date.now().toString());
      
      toast({
        title: "Success! 🎉",
        description: "Check your email for your free legal guide!",
      });

      setIsVisible(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('newsletter_banner_dismissed', Date.now().toString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">Get Free Legal Help in Your Inbox</p>
              <p className="text-xs sm:text-sm opacity-90">Join 5,000+ Canadians getting free legal tips & resources</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 w-full sm:w-64"
              required
            />
            <Button 
              type="submit" 
              variant="secondary"
              disabled={isSubmitting}
              className="whitespace-nowrap"
            >
              {isSubmitting ? 'Joining...' : 'Get Free Guide'}
            </Button>
          </form>

          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
