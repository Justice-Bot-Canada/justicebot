import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, Zap, Clock, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import PayPalTrialButton from "@/components/PayPalTrialButton";

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

  // Check if user has purchased this specific form
  useEffect(() => {
    const checkFormPurchase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setCheckingAccess(false);
          return;
        }

        // Check entitlements for this specific form
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

  // Handle one-time form purchase via edge function
  const handleFormPurchase = async () => {
    setLoading("form");
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

      // Get promo code from localStorage if available
      const promoCode = localStorage.getItem('appliedPromoCode') || undefined;

      const { data, error } = await supabase.functions.invoke('create-form-payment', {
        body: { formId, promoCode }
      });

      if (error) throw error;
      
      if (data?.approvalUrl) {
        console.log('Redirecting to PayPal:', data.approvalUrl);
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received from PayPal');
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

  // Premium users or users who purchased this form get access
  if (checkingAccess) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isPremium || hasAccess || hasPurchased) {
    return <>{children}</>;
  }

  // PayPal plan ID with 5-day trial
  const PAYPAL_TRIAL_PLAN_ID = "P-2GT19989129104740NFBBDVY";

  const handleSubscription = async () => {
    setLoading("subscription");
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-subscription', {
        body: { planId: PAYPAL_TRIAL_PLAN_ID }
      });

      if (error) throw error;
      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {daysUntilDeadline && daysUntilDeadline <= 7 && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-orange-600" />
            <p className="font-semibold text-orange-900 dark:text-orange-100">
              {daysUntilDeadline <= 3 ? (
                <span className="text-red-600 dark:text-red-400">
                  ⚠️ URGENT: Only {daysUntilDeadline} days left to file!
                </span>
              ) : (
                `Time-sensitive: ${daysUntilDeadline} days remaining to submit`
              )}
            </p>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary">Premium Form Access</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Access "{formTitle}"</h2>
        <p className="text-muted-foreground">
          Complete your legal forms in minutes with AI-powered assistance
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* One-Time Purchase */}
        <Card className="relative border-2 hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">Single Form</CardTitle>
              <Badge variant="outline">One-Time</Badge>
            </div>
            <CardDescription>Perfect if you need just this form</CardDescription>
            <div className="mt-4">
              <div className="text-4xl font-bold">$5.99</div>
              <div className="text-sm text-muted-foreground">one-time payment</div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Instant access to {formTitle}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">AI-powered form filling assistance</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">PDF generation & download</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Lifetime access to this form</span>
              </li>
            </ul>

            <Button 
              onClick={handleFormPurchase}
              disabled={loading !== null}
              className="w-full"
              size="lg"
            >
              {loading === "form" ? (
                "Processing..."
              ) : (
                "Pay with PayPal - $5.99"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Free Trial / Subscription */}
        <Card className="relative border-primary ring-2 ring-primary/20">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
              <Sparkles className="w-3 h-3 mr-1" />
              5-Day FREE Trial
            </Badge>
          </div>

          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">Unlimited</CardTitle>
              <Badge variant="outline">Try Free</Badge>
            </div>
            <CardDescription>Full access for 5 days, then $19/mo</CardDescription>
            <div className="mt-4">
              <div className="text-4xl font-bold text-green-600">FREE</div>
              <div className="text-sm text-muted-foreground">for 5 days, then $19/mo</div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Unlimited access to ALL forms</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">AI legal chatbot & document analysis</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Priority customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Cancel anytime - no charge if cancelled before trial ends</span>
              </li>
            </ul>

            <PayPalTrialButton planId={PAYPAL_TRIAL_PLAN_ID} trialDays={5} />
          </CardContent>
        </Card>
      </div>

      {daysUntilDeadline && daysUntilDeadline <= 7 && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Complete your forms in under 20 minutes - Don't miss your deadline!
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>🔒 Secure payment powered by PayPal • 30-day money-back guarantee</p>
      </div>
    </div>
  );
}
