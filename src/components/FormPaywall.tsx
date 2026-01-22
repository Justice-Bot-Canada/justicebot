import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Clock, Sparkles, Unlock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { useShouldHidePricing } from "@/components/ProgramBanner";
import { analytics } from "@/utils/analytics";
import { UnlockButton } from "@/components/UnlockButton";
import { BeforeYouPayExplanation } from "@/components/BeforeYouPayExplanation";
import { PaymentTrustSignals, LegalDisclaimer } from "@/components/PaymentTrustSignals";
import StripeTrialButton from "@/components/StripeTrialButton";

// Stripe Price IDs
const STRIPE_PRICE_IDS = {
  basic: "price_1SgdrpL0pLShFbLtWKJfGCO3",
  professional: "price_1SgdzJL0pLShFbLtcFrnbeiV",
  premium: "price_1Sge6YL0pLShFbLtR8BpRnuM",
  oneTimeDocument: "price_1SmUwAL0pLShFbLtIK429fdX", // $39 one-time
};

interface FormPaywallProps {
  formId: string;
  formTitle: string;
  formPrice?: number;
  onAccessGranted?: () => void;
  children?: React.ReactNode;
  daysUntilDeadline?: number;
}

export default function FormPaywall({
  formId,
  formTitle,
  formPrice = 599,
  daysUntilDeadline,
  children,
}: FormPaywallProps) {
  const [loading, setLoading] = useState<"subscription" | "form" | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const { hasAccess, isPremium } = usePremiumAccess();
  const shouldHidePricing = useShouldHidePricing();
  const paywallViewFired = useRef(false);

  // Check if user has purchased this specific form
  useEffect(() => {
    const checkFormPurchase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setCheckingAccess(false);
          return;
        }

        const { data, error } = await supabase
          .from('entitlements')
          .select('product_id')
          .eq('user_id', user.id)
          .eq('product_id', `form_${formId}`)
          .maybeSingle();

        if (!error && data) {
          setHasPurchased(true);
        }
      } catch (error) {
        console.error('Error checking form purchase:', error);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkFormPurchase();
  }, [formId]);

  // Fire GA4 paywall_view event when paywall is shown
  useEffect(() => {
    if (!checkingAccess && !isPremium && !hasAccess && !hasPurchased && !paywallViewFired.current) {
      paywallViewFired.current = true;
      analytics.paywallView(formTitle || 'form_access');
    }
  }, [checkingAccess, isPremium, hasAccess, hasPurchased, formTitle]);

  // Handle one-time form purchase via Stripe
  const handleFormPurchase = async () => {
    setLoading("form");
    analytics.funnelBeginCheckout({ value: 39, itemName: formTitle || 'Legal Form' });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to purchase this form",
          variant: "destructive",
        });
        setLoading(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create_checkout', {
        body: { 
          priceId: STRIPE_PRICE_IDS.oneTimeDocument,
          planKey: 'one_time_document',
          successUrl: `${window.location.origin}/payment-success?formId=${formId}&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  // Loading state
  if (checkingAccess) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Access granted
  if (isPremium || hasAccess || hasPurchased || shouldHidePricing) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Urgent deadline warning - mobile friendly */}
      {daysUntilDeadline && daysUntilDeadline <= 7 && (
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
              {daysUntilDeadline <= 3 ? (
                <span className="text-red-600 dark:text-red-400">
                  Only {daysUntilDeadline} days left to file
                </span>
              ) : (
                `${daysUntilDeadline} days remaining`
              )}
            </p>
          </div>
        </div>
      )}

      {/* Header - simpler, mobile friendly */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5">
          <Unlock className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">Ready to unlock</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">{formTitle}</h2>
      </div>

      {/* Before You Pay - What you're getting */}
      <BeforeYouPayExplanation
        productName={formTitle}
        whyItMatters="Filing the correct form saves time and prevents your case from being rejected"
        problemItSolves="We pre-fill your details and guide you through each section"
        immediateDeliverable="Download your completed form, ready to file"
        variant="compact"
      />

      {/* Single prominent CTA - no choice paralysis */}
      <Card className="border-2 border-primary">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">$39</div>
            <p className="text-sm text-muted-foreground">One-time payment</p>
          </div>

          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Complete form with your details filled in</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Step-by-step filing instructions</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Download and keep forever</span>
            </li>
          </ul>

          <UnlockButton
            unlockLabel="This Form"
            price="$39"
            isLoading={loading === "form"}
            onClick={handleFormPurchase}
          />

          <PaymentTrustSignals variant="minimal" showCanadianBuilt={false} />
        </CardContent>
      </Card>

      {/* Alternative: subscription (de-emphasized) */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground mb-3">
          Need access to multiple forms?
        </p>
        <Card className="border-dashed">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                5-Day Free Trial
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Unlimited forms for 5 days, then $29/mo. Cancel anytime.
            </p>
            <StripeTrialButton 
              priceId={STRIPE_PRICE_IDS.professional} 
              planKey="professional" 
              trialDays={5} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Legal disclaimer */}
      <LegalDisclaimer />
    </div>
  );
}
