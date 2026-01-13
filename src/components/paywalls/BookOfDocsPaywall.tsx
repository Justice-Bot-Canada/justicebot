import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, BookOpen, ArrowLeft, Loader2, Shield, CreditCard } from "lucide-react";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useShouldHidePricing } from "@/components/ProgramBanner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast-stub";
import { analytics, trackEvent } from "@/utils/analytics";
import AuthDialog from "@/components/AuthDialog";

// $39 CAD one-time - Book of Documents Generator
const STRIPE_PRICE_ID = "price_1SmUwAL0pLShFbLtIK429fdX";
const PRODUCT_KEY = "book_docs_generator";
const PRODUCT_PRICE = 39;

interface BookOfDocsPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccessGranted: () => void;
  caseId: string;
  caseTitle?: string;
}

export function BookOfDocsPaywall({
  open,
  onOpenChange,
  onAccessGranted,
  caseId,
  caseTitle,
}: BookOfDocsPaywallProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isFreeUser, tier, loading: accessLoading } = usePremiumAccess();
  const shouldHidePricing = useShouldHidePricing();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Premium/program users bypass paywall
  const isPremium = hasAccess && (tier === "monthly" || tier === "yearly");

  if ((isPremium || shouldHidePricing || isFreeUser) && open) {
    onAccessGranted();
    onOpenChange(false);
    return null;
  }

  // Check if user already has entitlement for this specific product
  const checkExistingEntitlement = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data } = await supabase
        .from("entitlements")
        .select("product_id, ends_at")
        .eq("user_id", user.id)
        .or(`product_id.eq.${STRIPE_PRICE_ID},product_id.eq.${PRODUCT_KEY}`);
      
      if (data && data.length > 0) {
        // Check if any entitlement is still valid
        const hasValidEntitlement = data.some(e => {
          if (!e.ends_at) return true; // Permanent access
          return new Date(e.ends_at) > new Date();
        });
        
        if (hasValidEntitlement) {
          onAccessGranted();
          onOpenChange(false);
          return true;
        }
      }
    } catch (err) {
      console.error("Error checking entitlement:", err);
    }
    return false;
  };

  const handlePurchase = async () => {
    // If not logged in, show auth dialog first
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    // Check if already has access
    const hasExisting = await checkExistingEntitlement();
    if (hasExisting) return;

    setIsProcessing(true);

    // Track checkout initiation (NOT purchase - that fires after webhook confirms)
    trackEvent("checkout_initiated", {
      product: PRODUCT_KEY,
      product_id: STRIPE_PRICE_ID,
      price: PRODUCT_PRICE,
      currency: "CAD",
      case_id: caseId,
    });

    analytics.beginCheckout(PRODUCT_KEY, "Book of Documents Generator", PRODUCT_PRICE);

    try {
      const { data, error } = await supabase.functions.invoke("create_checkout", {
        body: {
          priceId: STRIPE_PRICE_ID,
          productType: "one_time",
          successUrl: `${window.location.origin}/documents-unlocked?session_id={CHECKOUT_SESSION_ID}&case=${caseId}&product=${PRODUCT_KEY}`,
          cancelUrl: `${window.location.origin}/evidence?case=${caseId}`,
          metadata: {
            product_id: PRODUCT_KEY,
            entitlement_key: PRODUCT_KEY,
            case_id: caseId,
            price_id: STRIPE_PRICE_ID,
            product_name: "Book of Documents Generator",
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Unable to start payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const features = [
    "AI-organized evidence book with professional formatting",
    "Cover page with case details and party names",
    "Automatic table of contents with page references",
    "Chronologically sorted exhibits with proper labels",
    "Certificate of service template included",
    "Downloadable court-ready PDF",
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Generate Your Book of Documents
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Create a professional, court-ready evidence bundle in minutes.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Price block */}
            <div className="text-center py-4 border-y">
              <p className="text-sm text-muted-foreground font-medium">One-Time Payment</p>
              <p className="text-4xl font-bold text-foreground">$39</p>
              <p className="text-sm text-muted-foreground">
                No subscriptions. Unlimited downloads for this case.
              </p>
            </div>

            {/* Trust signals */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure payment via Stripe</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4 text-green-600" />
                <span>Instant access after payment</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-3 pt-2">
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay $39 — Generate My Book
                </>
              )}
            </Button>

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
              Payment unlocks document generation for this case only.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={(open) => {
          setShowAuthDialog(open);
          // After auth, retry purchase
          if (!open && user) {
            setTimeout(() => handlePurchase(), 500);
          }
        }}
      />
    </>
  );
}
