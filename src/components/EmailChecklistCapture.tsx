import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Check } from "lucide-react";
import { submitLead } from "@/api/leads";
import { toast } from "sonner";
import { trackEvent } from "@/utils/analytics";

interface EmailChecklistCaptureProps {
  legalArea?: string;
  province?: string;
}

export default function EmailChecklistCapture({ legalArea, province }: EmailChecklistCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        source: 'exit_checklist',
        payload: { legalArea, province, type: 'checklist_email' }
      });
      
      trackEvent('checklist_email_captured', { legalArea, province });
      setSubmitted(true);
      toast.success("We'll email you your checklist!");
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <Check className="h-4 w-4" />
        <span>Checklist sent! Check your inbox.</span>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 border">
      <p className="text-sm font-medium mb-2">Not ready? Email yourself your checklist.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSubmitting} size="sm">
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Send it
              <Send className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
