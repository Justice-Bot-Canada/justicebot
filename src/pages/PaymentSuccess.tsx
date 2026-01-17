import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analytics } from "@/utils/analytics";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const purchaseEventFired = useRef(false);
  const { refetch: refetchPremiumAccess } = usePremiumAccess();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment details from URL - Stripe uses session_id
        const sessionId = searchParams.get('session_id');
        const formIdParam = searchParams.get('formId');
        
        if (formIdParam) setFormId(formIdParam);
        
        if (!sessionId) {
          console.error('No session ID in URL');
          setVerifying(false);
          return;
        }

        // Verify payment with Stripe
        const { data, error } = await supabase.functions.invoke('verify-stripe-payment', {
          body: { sessionId }
        });

        if (error) throw error;

        if (data?.success) {
          setVerified(true);
          
          // CRITICAL: Refresh premium access state immediately after payment
          await refetchPremiumAccess();
          
          // Track payment completion with legacy analytics
          const plan = searchParams.get('plan') || 'form_purchase';
          const amount = searchParams.get('amount') || '39';
          analytics.paymentCompleted(plan, amount, sessionId);
          
          // Fire GA4 purchase event - NON-NEGOTIABLE for funnel tracking
          // Only fire once to prevent duplicates on refresh
          if (!purchaseEventFired.current) {
            purchaseEventFired.current = true;
            const value = parseFloat(amount) || 39;
            
            // New funnel events
            analytics.paymentCompletedEvent(sessionId || crypto.randomUUID(), value);
            analytics.featuresUnlocked(formIdParam || undefined);
            
            // Legacy GA4 purchase event
            analytics.funnelPurchase({
              transactionId: sessionId || crypto.randomUUID(),
              value,
              itemName: plan === 'form_purchase' ? 'Legal Form' : 'Case Assessment',
            });
          }
          
          toast({
            title: "Access Unlocked",
            description: "You can continue right away.",
          });
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Verification Failed",
          description: "Please contact support if you were charged.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground">Please wait while we confirm your purchase.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            {verified ? 'Access Unlocked' : 'Thank You!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {verified 
              ? 'You can continue right away. Your access is now active.'
              : 'Your transaction has been processed. You should receive a confirmation email shortly.'}
          </p>
          <div className="space-y-2">
            {formId && verified && (
              <Button 
                onClick={() => navigate(`/forms?id=${formId}`)}
                className="w-full"
              >
                Access Your Form
              </Button>
            )}
            <Button 
              onClick={() => navigate("/forms")}
              className="w-full"
              variant={formId ? "outline" : "default"}
            >
              View All Forms
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
