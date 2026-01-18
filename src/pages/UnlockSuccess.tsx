import { CheckCircle, FileText, ListChecks, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { analytics } from "@/utils/analytics";
import { supabase } from "@/integrations/supabase/client";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";

/**
 * Success page specifically for $5.99 Form Unlock purchase
 * Verifies payment and creates entitlement, then shows immediate value
 */
const UnlockSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verificationAttempted = useRef(false);
  const { refetch: refetchPremiumAccess } = usePremiumAccess();

  useEffect(() => {
    const verifyPayment = async () => {
      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      if (!sessionId) {
        setVerifying(false);
        setError('Missing session ID. Please use the link from your Stripe receipt or contact support.');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-stripe-payment', {
          body: { sessionId }
        });

        if (error) throw error;

        if (data?.success) {
          setVerified(true);
          
          // CRITICAL: Refresh premium access state immediately after payment
          await refetchPremiumAccess();
          
          // CONVERSION: payment_completed GA4 event (mark in GA4 Admin)
          analytics.paymentCompletedGA4(sessionId, 5.99, data.product || 'Emergency Form Unlock');
          
          analytics.funnelPurchase({
            transactionId: sessionId,
            value: 5.99,
            itemName: data.product || 'Emergency Form Unlock',
          });
        } else {
          setError(data?.error || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('We could not confirm your payment yet. If you were charged, email support@justice-bot.com with your receipt.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 pb-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Confirming your payment...</h1>
            <p className="text-muted-foreground">Just a moment while we unlock your access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-red-200">
          <CardContent className="pt-8 pb-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/pricing')} variant="outline">
              Try Again
            </Button>
            <p className="text-xs text-muted-foreground">
              If you were charged, email support@justice-bot.com with your receipt.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-green-200 shadow-lg">
        <CardContent className="pt-8 pb-6 space-y-6">
          {/* Success header - dopamine moment */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              You're unlocked. Let's get you unstuck.
            </h1>
            <p className="text-muted-foreground">
              Your $5.99 access is now active. Here's what you can do:
            </p>
          </div>

          {/* Immediate value - what they bought */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Document Checklist</p>
                <p className="text-sm text-muted-foreground">See exactly what documents you need for your case</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <ListChecks className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Step-by-Step Filing Guide</p>
                <p className="text-sm text-muted-foreground">Follow clear instructions to file your forms correctly</p>
              </div>
            </div>
          </div>

          {/* Primary CTA - start immediately */}
          <Button 
            size="lg"
            onClick={() => navigate("/intake")}
            className="w-full text-lg py-6"
          >
            Start Here
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Questions? Email support@justice-bot.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnlockSuccess;
