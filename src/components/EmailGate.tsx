import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ArrowRight, CheckCircle, Eye } from "lucide-react";
import { submitLead } from "@/api/leads";
import { toast } from "sonner";
import { trackEvent, analytics } from "@/utils/analytics";

interface EmailGateProps {
  title?: string;
  description?: string;
  ctaText?: string;
  source?: string;
  onUnlock: (email: string) => void;
  benefits?: string[];
}

const EmailGate = ({ 
  title = "See your results",
  description = "Enter your email to unlock your personalized legal pathway",
  ctaText = "Show my results",
  source = "email_gate",
  onUnlock,
  benefits = [
    "Your recommended legal venue",
    "Which forms apply to you",
    "Important deadlines",
    "Next steps to take"
  ]
}: EmailGateProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        source,
        payload: { gated_content: 'triage_results' }
      });
      
      trackEvent('email_gate_unlocked', { source });
      analytics.signupComplete('email', email);
      
      // Store in session so they don't need to re-enter
      sessionStorage.setItem('gated_email', email);
      
      onUnlock(email);
      toast.success("Unlocking your results...");
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-primary/30 overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary/20">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base mt-1">{description}</CardDescription>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">You'll see:</p>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 text-base"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base gap-2"
                variant="cta"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Unlocking..."
                ) : (
                  <>
                    {ctaText}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                We'll never spam you. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmailGate;
