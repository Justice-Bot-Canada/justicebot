import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { analytics } from "@/utils/analytics";

interface PayPalSubscribeButtonProps {
  planId: string;
  containerId?: string;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

/**
 * PayPal Client ID - This is a PUBLIC key, safe to include in client code.
 * PayPal Client IDs are designed for browser-side use; the secret key remains server-side only.
 * This follows PayPal's SDK integration pattern.
 */
const PAYPAL_CLIENT_ID = "AS7gni64FdKWkeMYxUGCFStgDXhtyG0SooKeyMu-NwVDwFzrRC8iMfPmesMmSrGXZUQqYz69EsiQ9ril";

const PayPalSubscribeButton = ({ planId, containerId }: PayPalSubscribeButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
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

    return () => {
      // Cleanup script on unmount if needed
    };
  }, [toast]);

  useEffect(() => {
    if (sdkReady && window.paypal && containerRef.current) {
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
          // Track payment initiation
          analytics.paymentInitiated(planId, '0', 'paypal');
          return actions.subscription.create({
            plan_id: planId,
          });
        },
        onApprove: function (data: any) {
          console.log("Subscription approved:", data.subscriptionID);
          analytics.paymentCompleted(planId, '0', data.subscriptionID);
          toast({
            title: "Subscription Successful!",
            description: `Your subscription ID: ${data.subscriptionID}. Welcome to Justice-Bot!`,
          });
          // Redirect to success page
          navigate(`/subscription-success?subscription_id=${data.subscriptionID}`);
        },
        onError: function (err: any) {
          console.error("PayPal error:", err);
          analytics.paymentFailed(planId, '0', err?.message || 'unknown_error');
          toast({
            title: "Payment Error",
            description: "Something went wrong with your payment. Please try again.",
            variant: "destructive",
          });
        },
        onCancel: function () {
          analytics.paymentAbandoned(planId, '0', 'user_cancelled');
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment. No charges were made.",
          });
        },
      }).render(containerRef.current);
    }
  }, [sdkReady, planId, toast, navigate]);

  if (loading) {
    return (
      <div className="w-full h-12 bg-muted animate-pulse rounded flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id={containerId || `paypal-button-container-${planId}`}
      className="w-full min-h-[45px]"
    />
  );
};

export default PayPalSubscribeButton;
