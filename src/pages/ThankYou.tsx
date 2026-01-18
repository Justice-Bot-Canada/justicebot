import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, FileText, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import { analytics } from "@/utils/analytics";

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const { refetch: refetchPremiumAccess } = usePremiumAccess();
  const purchaseEventFired = useRef(false);

  const sessionId = searchParams.get("session_id");
  const orderId = sessionId || "Pending";
  const product = searchParams.get("product") || "Subscription / Document Access";
  const email = searchParams.get("email") || "your email";

  useEffect(() => {
    // If Stripe redirect, verify and capture payment
    if (sessionId && !isProcessing) {
      verifyStripePayment(sessionId);
    }

    // Store order info in session storage
    try {
      sessionStorage.setItem("jb_last_order_id", orderId);
      sessionStorage.setItem("jb_last_product", product);
    } catch (e) {
      console.error("Session storage error:", e);
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, orderId, product, navigate, isProcessing]);

  const verifyStripePayment = async (sessionId: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-stripe-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data?.success) {
        await refetchPremiumAccess();
        
        // CONVERSION: payment_completed GA4 event (mark in GA4 Admin) - fire once
        if (!purchaseEventFired.current) {
          purchaseEventFired.current = true;
          analytics.paymentCompletedGA4(sessionId, data.amount || 39, product);
          analytics.funnelPurchase({
            transactionId: sessionId,
            value: data.amount || 39,
            itemName: product,
          });
        }
        
        toast({
          title: "Payment Confirmed!",
          description: "Your premium access has been activated.",
        });
      } else {
        toast({
          title: "Payment Verification Pending",
          description: "Your access will be activated shortly.",
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment Processing",
        description: "We're verifying your payment. Check your email for confirmation.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAccessUrl = () => {
    if (product.toLowerCase().includes("document") || product.toLowerCase().includes("form")) {
      return "/forms";
    }
    return "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            {isProcessing ? (
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isProcessing ? "🔄 Processing Payment..." : "🎉 Thank You - Purchase Confirmed!"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isProcessing 
                ? "Please wait while we confirm your payment..."
                : "You now have access to your Justice-Bot tools."
              }
            </p>
            {!isProcessing && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                A receipt and next steps have been sent to <strong>{email}</strong>
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Order ID
              </div>
              <div className="font-semibold text-gray-900 dark:text-white truncate">
                {orderId}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Plan / Product
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {product}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Next
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                Redirecting in <Badge variant="secondary">{countdown}s</Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isProcessing && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(getAccessUrl())}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Access Your Tools Now
              </Button>
              
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check your email for your receipt and login details</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Explore your premium features in the dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Start generating professional legal documents</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Access AI-powered legal assistance anytime</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>
              Need help? Email{" "}
              <a 
                href="mailto:admin@justice-bot.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                admin@justice-bot.com
              </a>
            </p>
            <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
              If you're not redirected automatically, click "Go to Dashboard" above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
