import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, FolderArchive, ArrowRight, ArrowLeft } from "lucide-react";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import PayPalTrialButton from "@/components/PayPalTrialButton";

const PAYPAL_PLAN_ID = "P-0FR50831D4940483BNFBBB7Y";

interface EvidenceBundlePaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  evidenceCount?: number;
}

export function EvidenceBundlePaywall({
  open,
  onOpenChange,
  onConfirm,
  evidenceCount,
}: EvidenceBundlePaywallProps) {
  const { hasAccess, isFreeUser, loading } = usePremiumAccess();

  // If user has access, just confirm immediately
  if (hasAccess && open) {
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
              Create a Court-Ready Evidence Bundle
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              This feature is unlocked for early access users.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={onConfirm} className="w-full sm:w-auto" size="lg">
              <FolderArchive className="mr-2 h-4 w-4" />
              Export Evidence Bundle
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
            Create a Court-Ready Evidence Bundle
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Tribunals expect evidence to be organized, indexed, and easy to follow.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm font-medium text-foreground">
            This feature will:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Organize your evidence chronologically</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Generate a table of contents</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Automatically label and paginate exhibits</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Export a court-ready PDF or document bundle</span>
            </li>
          </ul>

          <p className="text-sm text-foreground font-medium pt-2">
            This saves hours of work and helps your evidence be taken seriously.
          </p>

          {evidenceCount && evidenceCount > 0 && (
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <p className="text-sm text-primary font-medium">
                You have {evidenceCount} piece{evidenceCount !== 1 ? 's' : ''} of evidence ready to bundle.
              </p>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-3 border">
            <p className="text-xs text-muted-foreground">
              You may continue uploading and viewing your evidence without exporting a bundle.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3 pt-2">
          <PayPalTrialButton planId={PAYPAL_PLAN_ID} trialDays={5} />
          
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue without exporting
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
