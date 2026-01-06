import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { analytics, trackEvent } from '@/utils/analytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Circle,
  Loader2,
  Upload,
  FileCheck,
  Download,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function DocumentsUnlocked() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [verifying, setVerifying] = useState(!!sessionId);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!sessionId || hasVerified.current) {
      if (!sessionId) setVerified(true); // Direct navigation (already paid)
      return;
    }

    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('verify-stripe-payment', {
          body: { sessionId },
        });

        if (fnError) throw fnError;

        if (data?.success) {
          setVerified(true);
          trackEvent('payment_completed', {
            product: 'court_ready_pack',
            sessionId,
          });
          trackEvent('documents_unlocked', {
            product: 'court_ready_pack',
          });
          analytics.funnelPurchase({ value: 39, itemName: 'Court-Ready Document Pack' });
        } else {
          setError(data?.error || 'Payment verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Unable to verify payment. Please contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const steps = [
    {
      id: 'triage',
      label: 'Triage complete',
      status: 'complete' as const,
      icon: CheckCircle,
    },
    {
      id: 'upload',
      label: 'Upload evidence',
      status: 'current' as const,
      icon: Upload,
      description: 'Add your supporting documents',
    },
    {
      id: 'generate',
      label: 'Documents generating',
      status: 'upcoming' as const,
      icon: FileCheck,
      description: 'AI organizes your case materials',
    },
    {
      id: 'download',
      label: 'Download & file',
      status: 'upcoming' as const,
      icon: Download,
      description: 'Get your court-ready package',
    },
  ];

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-lg text-muted-foreground">Verifying your payment...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold">Payment Issue</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => navigate('/triage')} variant="outline">
                Return to Triage
              </Button>
              <p className="text-xs text-muted-foreground">
                Need help? Email admin@justice-bot.com
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <Badge className="mb-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Payment Complete
              </Badge>
              <h1 className="text-3xl font-bold">You're all set — let's prepare your documents</h1>
              <p className="text-muted-foreground mt-2">
                Your Court-Ready Document Pack is now unlocked
              </p>
            </div>
          </div>

          {/* Progress Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                Follow these steps to complete your filing-ready package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                      step.status === 'current'
                        ? 'bg-primary/5 border border-primary/20'
                        : step.status === 'complete'
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {step.status === 'complete' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : step.status === 'current' ? (
                        <div className="h-6 w-6 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        </div>
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          step.status === 'upcoming' ? 'text-muted-foreground' : ''
                        }`}
                      >
                        {step.label}
                      </h4>
                      {step.description && (
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      )}
                    </div>
                    {step.status === 'current' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Next
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/evidence')}
            >
              Upload Your Evidence
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Or{' '}
              <button
                onClick={() => navigate('/dashboard')}
                className="text-primary hover:underline"
              >
                go to your dashboard
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
