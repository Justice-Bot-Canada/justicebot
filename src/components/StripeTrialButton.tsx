import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { analytics, trackEvent } from "@/utils/analytics";

interface StripeTrialButtonProps {
  priceId: string;
  planKey: string;
  trialDays?: number;
}

const StripeTrialButton = ({ priceId, planKey, trialDays = 5 }: StripeTrialButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStartTrial = async () => {
    try {
      setLoading(true);
      
      // Track analytics
      analytics.addToCart(planKey, planKey, 0);
      analytics.beginCheckout(planKey, planKey, 0);
      trackEvent('stripe_trial_started', { plan_key: planKey, trial_days: trialDays });

      const { data, error } = await supabase.functions.invoke("create_checkout", {
        body: { 
          priceId, 
          planKey, 
          trialDays,
          successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Same tab for continuity
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Stripe checkout error:", error);
      analytics.paymentFailed(planKey, '0', error instanceof Error ? error.message : 'unknown');
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleStartTrial}
        size="lg"
        variant="outline"
        className="w-full border-primary/50 hover:bg-primary/5 font-semibold py-4"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Opening checkout...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            Try Free for {trialDays} Days
          </>
        )}
      </Button>
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          <span>Card required</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
};

export default StripeTrialButton;
