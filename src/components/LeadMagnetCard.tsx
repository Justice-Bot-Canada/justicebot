import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { submitLead } from '@/api/leads';
import { useToast } from '@/hooks/use-toast';
import { TurnstileWidget } from '@/components/TurnstileWidget';

interface LeadMagnetCardProps {
  title: string;
  description: string;
  benefits: string[];
  downloadType: 'guide' | 'template' | 'checklist';
  journey?: string;
}

export function LeadMagnetCard({ 
  title, 
  description, 
  benefits, 
  downloadType,
  journey = 'general' 
}: LeadMagnetCardProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const { toast } = useToast();

  const getIcon = () => {
    switch (downloadType) {
      case 'guide': return <FileText className="h-8 w-8 text-primary" />;
      case 'template': return <Download className="h-8 w-8 text-primary" />;
      case 'checklist': return <CheckCircle className="h-8 w-8 text-primary" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only require token if Turnstile loaded successfully
    if (!turnstileToken && !turnstileError) {
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
        source: 'lead_magnet_card',
        journey,
        payload: { downloadType, title },
        turnstileToken
      });

      setIsSubmitted(true);
      
      toast({
        title: "Success! 🎉",
        description: "Check your email for your free download!",
      });
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

  if (isSubmitted) {
    return (
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Check Your Email!</h3>
          <p className="text-sm text-muted-foreground">
            We've sent your free {downloadType} to <strong>{email}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Don't see it? Check your spam folder.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {getIcon()}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{benefit}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${title}`}>Name</Label>
            <Input
              id={`name-${title}`}
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`email-${title}`}>Email</Label>
            <Input
              id={`email-${title}`}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {!turnstileError && (
            <TurnstileWidget 
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileError(true)}
            />
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting || (!turnstileToken && !turnstileError)}>
            <Download className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Sending...' : `Get Free ${downloadType.charAt(0).toUpperCase() + downloadType.slice(1)}`}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            100% free. Instant delivery. No credit card required.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
