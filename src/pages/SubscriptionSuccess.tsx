import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Crown, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionId = searchParams.get('subscription_id') || searchParams.get('token');
  const planType = searchParams.get('plan');

  useEffect(() => {
    const verifySubscription = async () => {
      if (!subscriptionId) {
        setError('No subscription ID found');
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-subscription-status', {
          body: { subscriptionId }
        });

        if (error) throw error;

        if (data.success) {
          setVerified(true);
          toast({
            title: 'Subscription Activated!',
            description: 'Your premium access has been granted.',
          });
          
          // Refresh user premium status
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 3000);
        } else {
          setError(data.message || 'Subscription verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Unable to verify subscription. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifySubscription();
  }, [subscriptionId, toast]);

  const getPlanName = (plan: string | null) => {
    switch (plan) {
      case 'low-income': return 'Low-Income Plan';
      case 'monthly': return 'Monthly Access';
      case 'yearly': return 'Yearly Access';
      default: return 'Premium Plan';
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {verifying && (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <CardTitle>Verifying Your Subscription</CardTitle>
                  <CardDescription>
                    Please wait while we confirm your payment with PayPal...
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {!verifying && verified && (
              <Card className="border-green-200">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-700">Subscription Activated!</CardTitle>
                  <CardDescription>
                    Welcome to {getPlanName(planType)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-600" />
                      Your Premium Features Are Now Active:
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Smart Document Drafter with AI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Legal Research Assistant (CanLII integration)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Case Merit Scorer dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span>Form Intelligence with autofill</span>
                      </li>
                      {(planType === 'yearly' || planType === 'monthly') && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <span>Evidence Strategist & Organizer</span>
                        </li>
                      )}
                      {planType === 'yearly' && (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span>Settlement Calculator (Premium Only)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span>Unlimited AI document generation</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-muted-foreground text-sm">
                      Redirecting to your dashboard in a few seconds...
                    </p>
                    <Button onClick={() => navigate('/dashboard')} size="lg">
                      Go to Dashboard Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!verifying && error && (
              <Card className="border-amber-200">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-amber-700">Verification Pending</CardTitle>
                  <CardDescription>
                    We're still processing your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This can take a few minutes. If your subscription doesn't appear within 10 minutes, please contact support with your subscription ID:
                    </p>
                    <div className="bg-muted p-3 rounded font-mono text-xs break-all">
                      {subscriptionId}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => window.location.reload()} 
                        variant="outline"
                        className="flex-1"
                      >
                        Try Again
                      </Button>
                      <Button 
                        onClick={() => navigate('/contact')}
                        className="flex-1"
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
