import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useShouldHidePricing } from "@/components/ProgramBanner";
import StripeTrialButton from "@/components/StripeTrialButton";

// Stripe Price ID for Professional plan ($29.99/mo)
const STRIPE_PRICE_ID = "price_1SgdzJL0pLShFbLtcFrnbeiV";

interface DocumentGenerationPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  documentType?: string;
}

export function DocumentGenerationPaywall({
  open,
  onOpenChange,
  onConfirm,
  documentType = "legal document",
}: DocumentGenerationPaywallProps) {
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
              You're Ready to Generate a Legal Document
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              This feature is unlocked for early access users.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={onConfirm} className="w-full sm:w-auto" size="lg">
              <FileText className="mr-2 h-4 w-4" />
              Generate My Document
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
            You're Ready to Generate a Legal Document
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            You've completed the analysis and Justice-Bot has identified the correct legal pathway for your case.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm font-medium text-foreground">
            Generating this document includes:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">The correct tribunal form for your situation</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Jurisdiction-specific formatting and requirements</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Smart autofill based on your answers and evidence</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">A court-ready document you can download and file</span>
            </li>
          </ul>

          <p className="text-sm text-foreground font-medium pt-2">
            This step turns your case from information into action.
          </p>

          <div className="bg-muted/50 rounded-lg p-3 border">
            <p className="text-xs text-muted-foreground">
              You can continue exploring your case and reviewing options at no cost. Payment is only required to generate documents.
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
            Continue without generating
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
