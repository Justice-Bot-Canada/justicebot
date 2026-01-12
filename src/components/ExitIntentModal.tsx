import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, FileText, Clock, CheckCircle } from "lucide-react";
import { submitLead } from "@/api/leads";
import { toast } from "sonner";
import { trackEvent } from "@/utils/analytics";

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExitIntentModal = ({ isOpen, onClose }: ExitIntentModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        source: 'exit_intent_modal',
        payload: { intent: 'legal_checklist' }
      });
      setIsSubmitted(true);
      trackEvent('exit_intent_captured', { email_captured: true });
      toast.success("Check your inbox!");
    } catch (error) {
      toast.error("Failed to save. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl">You're all set!</DialogTitle>
            <DialogDescription className="text-base">
              Check your inbox for your free legal checklist. We'll also send you helpful tips as you prepare your case.
            </DialogDescription>
            <Button onClick={onClose} className="mt-4">
              Continue browsing
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Not ready yet?
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Get your free legal preparation checklist sent to your inbox.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3 text-sm">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Step-by-step preparation guide for your legal issue</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>Important deadline reminders you can't miss</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>We'll never spam — only helpful legal tips</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send me the checklist"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            No signup required. Just helpful resources.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;
