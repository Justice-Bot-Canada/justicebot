import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, CreditCard } from "lucide-react";

interface PayPalTrialButtonProps {
  planId: string;
  trialDays?: number;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PAYPAL_CLIENT_ID = "AXJLz1toBVLEsWU8FUMZ0jdPSYD5AGCsjzsmm684QRadoAzbSFNNSTDdwBht84dg7z2Xz5plJ_7wLH_P";

const PayPalTrialButton = ({ planId, trialDays = 5 }: PayPalTrialButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPayPal, setShowPayPal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if PayPal SDK is already loaded
    if (window.paypal) {
      setSdkReady(true);
      setLoading(false);
      return;
    }

    // Load PayPal SDK
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.async = true;

    script.onload = () => {
      setSdkReady(true);
      setLoading(false);
    };

    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
      setLoading(false);
      toast({
        title: "Payment Error",
        description: "Failed to load payment system. Please refresh the page.",
        variant: "destructive",
      });
    };

    document.body.appendChild(script);
  }, [toast]);

  useEffect(() => {
    if (sdkReady && window.paypal && containerRef.current && showPayPal) {
      // Clear any existing buttons
      containerRef.current.innerHTML = "";

      window.paypal.Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: function (data: any, actions: any) {
          return actions.subscription.create({
            plan_id: planId,
          });
        },
        onApprove: function (data: any) {
          console.log("Trial subscription approved:", data.subscriptionID);
          toast({
            title: "🎉 Free Trial Started!",
            description: `Your ${trialDays}-day free trial has begun! You won't be charged until the trial ends.`,
          });
          // Redirect to success page
          navigate(`/subscription-success?subscription_id=${data.subscriptionID}&trial=true`);
        },
        onError: function (err: any) {
          console.error("PayPal error:", err);
          toast({
            title: "Payment Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        },
        onCancel: function () {
          setShowPayPal(false);
          toast({
            title: "Trial Setup Cancelled",
            description: "No worries! You can start your free trial anytime.",
          });
        },
      }).render(containerRef.current);
    }
  }, [sdkReady, planId, showPayPal, toast, navigate, trialDays]);

  const handleStartTrial = () => {
    setShowPayPal(true);
  };

  if (!showPayPal) {
    return (
      <div className="space-y-3">
        <Button
          onClick={handleStartTrial}
          size="lg"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 text-lg shadow-lg"
          disabled={loading}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start {trialDays}-Day FREE Trial
        </Button>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            <span>Card required</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Cancel anytime</span>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          No charge for {trialDays} days. Cancel before trial ends to avoid billing.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-12 bg-muted animate-pulse rounded flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-center font-medium text-green-600 dark:text-green-400">
        ✓ {trialDays}-day FREE trial • Billed after trial ends
      </p>
      <div
        ref={containerRef}
        id={`paypal-trial-button-${planId}`}
        className="w-full min-h-[45px]"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPayPal(false)}
        className="w-full text-xs"
      >
        ← Go back
      </Button>
    </div>
  );
};

export default PayPalTrialButton;
