import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Unlock, Bookmark, Shield } from "lucide-react";
import StripeTrialButton from "@/components/StripeTrialButton";

// Stripe Price ID for Professional plan ($29.99/mo)
const STRIPE_PRICE_ID = "price_1SgdzJL0pLShFbLtcFrnbeiV";

interface PaymentUnlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionName?: string;
  caseId?: string;
  onSaveProgress?: () => void;
}

/**
 * Payment unlock modal - appears when user clicks a gated action.
 * Calm, honest, non-pushy copy focused on continuation.
 * 
 * RULES:
 * - Never paywall curiosity (signup, evidence upload, merit score, viewing results)
 * - Only paywall action (form generation, document download, advanced drafting)
 */
export function PaymentUnlockModal({ 
  open, 
  onOpenChange, 
  actionName = "this step",
  caseId,
  onSaveProgress
}: PaymentUnlockModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Unlock className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            You're ready to move forward
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            You've reviewed your case assessment.
            To continue with {actionName}, you'll need to unlock access.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm font-medium text-foreground">
            This unlock gives you:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Form generation based on your case</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Saved documents and drafts</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Ongoing guidance for this case</span>
            </li>
          </ul>
        </div>

        {/* Trust signal */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <Shield className="h-4 w-4 flex-shrink-0" />
          <span>You won't lose your work. Your case, evidence, and score are already saved.</span>
        </div>

        <DialogFooter className="flex-col gap-3 pt-4">
          <StripeTrialButton priceId={STRIPE_PRICE_ID} planKey="professional" trialDays={5} />
          
          <Button
            variant="ghost"
            onClick={() => {
              onSaveProgress?.();
              onOpenChange(false);
            }}
            className="w-full text-muted-foreground gap-2"
          >
            <Bookmark className="h-4 w-4" />
            Save my progress and come back later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentUnlockModal;
