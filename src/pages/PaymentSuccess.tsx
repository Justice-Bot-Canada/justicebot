import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analytics } from "@/utils/analytics";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Track payment completion with URL params
    const plan = searchParams.get('plan') || 'Unknown';
    const amount = searchParams.get('amount') || '0';
    const paymentId = searchParams.get('paymentId') || searchParams.get('orderId');
    
    analytics.paymentCompleted(plan, amount, paymentId || undefined);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been processed successfully.
            You should receive a confirmation email shortly.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => window.location.href = "/dashboard"}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/"}
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