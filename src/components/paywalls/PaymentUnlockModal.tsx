import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Lock, ArrowLeft, Bookmark } from "lucide-react";
import PayPalTrialButton from "@/components/PayPalTrialButton";

const PAYPAL_PLAN_ID = "P-5ML4271244454362LMUCPG7I";

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
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Continue with {actionName}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            You've already seen your case assessment.
            To continue with this action, you'll need to unlock access.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm font-medium text-foreground">
            What you're unlocking
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
              <span className="text-sm">Continued case analysis and guidance</span>
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col gap-3 pt-2">
          <PayPalTrialButton planId={PAYPAL_PLAN_ID} trialDays={5} />
          
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

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Your case and evidence are saved.
          </p>
          <p className="text-xs text-muted-foreground">
            You won't lose your work if you leave.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentUnlockModal;
