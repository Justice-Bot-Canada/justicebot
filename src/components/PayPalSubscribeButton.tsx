import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PayPalSubscribeButtonProps {
  planId: string;
  containerId?: string;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

const PAYPAL_CLIENT_ID = "AXJLz1toBVLEsWU8FUMZ0jdPSYD5AGCsjzsmm684QRadoAzbSFNNSTDdwBht84dg7z2Xz5plJ_7wLH_P";

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
          return actions.subscription.create({
            plan_id: planId,
          });
        },
        onApprove: function (data: any) {
          console.log("Subscription approved:", data.subscriptionID);
          toast({
            title: "Subscription Successful!",
            description: `Your subscription ID: ${data.subscriptionID}. Welcome to Justice-Bot!`,
          });
          // Redirect to success page
          navigate(`/subscription-success?subscription_id=${data.subscriptionID}`);
        },
        onError: function (err: any) {
          console.error("PayPal error:", err);
          toast({
            title: "Payment Error",
            description: "Something went wrong with your payment. Please try again.",
            variant: "destructive",
          });
        },
        onCancel: function () {
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
