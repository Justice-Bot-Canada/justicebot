import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ClipboardList, ArrowRight, ArrowLeft } from "lucide-react";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useShouldHidePricing } from "@/components/ProgramBanner";
import StripeTrialButton from "@/components/StripeTrialButton";

// Stripe Price ID for Professional plan ($29.99/mo)
const STRIPE_PRICE_ID = "price_1SgdzJL0pLShFbLtcFrnbeiV";

interface FilingInstructionsPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  tribunal?: string;
}

export function FilingInstructionsPaywall({
  open,
  onOpenChange,
  onConfirm,
  tribunal = "your tribunal",
}: FilingInstructionsPaywallProps) {
  const { hasAccess, isFreeUser, loading } = usePremiumAccess();
  const shouldHidePricing = useShouldHidePricing();

  // Program users and users with access bypass paywall
  if ((hasAccess || shouldHidePricing) && open) {
    onConfirm();
    onOpenChange(false);
    return null;
  }

  // Early access free user variant
  if (isFreeUser && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <span className="text-lg">🎁</span>
              <span className="font-semibold">Early Access Unlocked</span>
            </div>
            <DialogTitle className="text-xl">
              Step-by-Step Filing Help
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              This feature is unlocked for early access users.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={onConfirm} className="w-full sm:w-auto" size="lg">
              <ClipboardList className="mr-2 h-4 w-4" />
              View Filing Instructions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Step-by-Step Filing Help
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Filing correctly matters. Missing a step, deadline, or service requirement can delay or harm your case.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm font-medium text-foreground">
            This guided filing help includes:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">A personalized filing checklist for {tribunal}</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Clear instructions on where and how to file</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Service requirements (who must be served and how)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">What happens next after you file</span>
            </li>
          </ul>

          <p className="text-sm text-foreground font-medium pt-2">
            This guidance is designed to help self-represented people file with confidence.
          </p>

          <div className="bg-muted/50 rounded-lg p-3 border">
            <p className="text-xs text-muted-foreground">
              You can still view your forms and case details without purchasing this guidance.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 pt-2">
          <StripeTrialButton priceId={STRIPE_PRICE_ID} planKey="professional" trialDays={5} />
          
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            I'll file on my own
          </Button>
        </DialogFooter>

        <div className="text-center pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Justice-Bot charges only for action-based services.<br />
            Legal information, pathway recommendations, and merit scoring remain free.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
