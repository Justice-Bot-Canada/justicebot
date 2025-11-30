import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitLead } from '@/api/leads';
import { useToast } from '@/hooks/use-toast';
import { Gift, X } from 'lucide-react';
import { TurnstileWidget } from '@/components/TurnstileWidget';

interface LeadCaptureModalProps {
  trigger?: 'time' | 'scroll' | 'exit' | 'manual';
  delaySeconds?: number;
}

export function LeadCaptureModal({ trigger = 'time', delaySeconds = 30 }: LeadCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user already submitted or dismissed - never show again
    const lastSubmit = localStorage.getItem('lead_submitted');
    const dismissed = localStorage.getItem('lead_modal_dismissed');
    
    if (lastSubmit || dismissed) {
      return; // Never show again if already submitted or dismissed
    }

    if (trigger === 'time') {
      const timer = setTimeout(() => setIsOpen(true), delaySeconds * 1000);
      return () => clearTimeout(timer);
    }

    if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50 && !isOpen) {
          setIsOpen(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    if (trigger === 'exit') {
      let hasTriggered = false;
      
      const handleMouseLeave = (e: MouseEvent) => {
        // Only trigger if mouse leaves from top and hasn't triggered yet
        if (e.clientY <= 0 && !hasTriggered && !isOpen) {
          hasTriggered = true;
          setIsOpen(true);
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
      
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [trigger, delaySeconds, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast({
        title: "Verification required",
        description: "Please complete the security check",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead({
        email,
        name,
        source: 'lead_capture_modal',
        journey: 'newsletter',
        payload: { trigger },
        turnstileToken
      });

      localStorage.setItem('lead_submitted', Date.now().toString());
      
      toast({
        title: "Success! 🎉",
        description: "Check your email for your free legal guide and exclusive resources!",
      });

      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('lead_modal_dismissed', Date.now().toString());
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">Get Your Free Legal Guide</DialogTitle>
          <DialogDescription className="text-center">
            Join 5,000+ Canadians who've successfully navigated their legal issues. Get instant access to:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Free Ontario Legal Rights Guide</strong> - Know your rights in minutes
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Exclusive Legal Tips</strong> - Mistakes to avoid in court
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">✓</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Priority Updates</strong> - New legal resources & AI features
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <TurnstileWidget 
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => {
              toast({
                title: "Security verification not configured",
                description: "Please contact support to enable this feature",
                variant: "destructive",
              });
              // Close modal since verification isn't available
              setTimeout(() => setIsOpen(false), 3000);
            }}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting || !turnstileToken}>
            {isSubmitting ? 'Sending...' : 'Get Free Guide Now'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
