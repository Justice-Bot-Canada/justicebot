import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";

interface FormPaywallProps {
  formId: string;
  formTitle: string;
  formPrice: number; // in cents
  onAccessGranted: () => void;
  children: React.ReactNode;
}

export default function FormPaywall({
  formId,
  formTitle,
  formPrice,
  onAccessGranted,
  children,
}: FormPaywallProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { hasAccess, isPremium } = usePremiumAccess();
  const { toast } = useToast();

  // Premium users get all forms free
  if (isPremium || hasAccess) {
    return <>{children}</>;
  }

  const handlePayForForm = async () => {
    try {
      setIsProcessing(true);

      const { data, error } = await supabase.functions.invoke("create-form-payment", {
        body: {
          formId,
          amount: formPrice,
          currency: "CAD",
        },
      });

      if (error) throw error;

      if (data?.approvalUrl) {
        // Open PayPal checkout in new tab
        window.open(data.approvalUrl, "_blank");
        
        toast({
          title: "Payment initiated",
          description: "Complete the payment in the new window to access this form.",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="pointer-events-none select-none blur-sm opacity-50">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Purchase access to <strong>{formTitle}</strong> to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">
                ${(formPrice / 100).toFixed(2)} CAD
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                One-time payment for lifetime access
              </p>
            </div>

            <Button
              onClick={handlePayForForm}
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isProcessing ? "Processing..." : "Pay with PayPal"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Or upgrade to Premium for unlimited access to all forms
              </p>
              <Button variant="link" size="sm" asChild>
                <a href="/pricing">View Plans</a>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Instant access after payment</li>
                <li>✓ Secure PayPal checkout</li>
                <li>✓ Download completed forms as PDF</li>
                <li>✓ Save progress and return anytime</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
