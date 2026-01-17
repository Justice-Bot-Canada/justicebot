import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { trackEvent, analytics } from '@/utils/analytics';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  Circle,
  Loader2,
  Upload,
  FileCheck,
  Download,
  ArrowRight,
  AlertCircle,
  Unlock,
  RefreshCw,
} from 'lucide-react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';

type StepStatus = 'complete' | 'current' | 'upcoming';

interface Step {
  id: string;
  label: string;
  status: StepStatus;
  icon: 'check' | 'unlock' | 'upload' | 'generate' | 'download';
}

export default function DocumentsUnlocked() {
  const navigate = useNavigate();
  const { caseId: paramCaseId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const productKey = searchParams.get('product') || 'court_ready_pack';

  // Support both route param and query param for caseId
  const caseId = paramCaseId || searchParams.get('caseId') || searchParams.get('case');

  const [verifying, setVerifying] = useState(!!sessionId);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{
    product_id: string;
    value: number;
    transaction_id: string;
  } | null>(null);
  const hasVerified = useRef(false);
  const purchaseEventFired = useRef(false);
  const { refetch: refetchPremiumAccess } = usePremiumAccess();

  useEffect(() => {
    // Track page view
    trackEvent('next_steps_viewed', { caseId, product: productKey });
  }, [caseId, productKey]);

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
          
          // CRITICAL: Refresh premium access state immediately after payment
          await refetchPremiumAccess();
          
          // Extract payment details from verification response
          const verifiedProductId = data.product_id || data.product || productKey;
          const verifiedValue = data.value || data.amount_total ? (data.amount_total / 100) : 39;
          const transactionId = data.payment_intent_id || sessionId;
          
          setPaymentDetails({
            product_id: verifiedProductId,
            value: verifiedValue,
            transaction_id: transactionId,
          });
          
          // CRITICAL: Only fire purchase event AFTER server-side verification confirms payment
          // This ensures GA = Stripe = Supabase (same truth)
          if (!purchaseEventFired.current) {
            purchaseEventFired.current = true;
            
            // Fire GA4 purchase event with CORRECT product_id and value (no more "(not set)")
            analytics.paymentCompletedEvent(transactionId, verifiedValue);
            analytics.featuresUnlocked(data.caseId || caseId);
            
            // Fire GA4 purchase event for funnel tracking with product_id
            analytics.funnelPurchase({
              transactionId: transactionId,
              value: verifiedValue,
              itemName: data.product_name || 'Book of Documents Generator',
            });
            
            // Fire complete purchase event with all required fields
            trackEvent('purchase', {
              transaction_id: transactionId,
              value: verifiedValue,
              currency: 'CAD',
              product_id: verifiedProductId,
              product_name: data.product_name || 'Book of Documents Generator',
              case_id: data.caseId || caseId,
              verified_by_server: true,
            });
            
            // Legacy event for backwards compatibility
            trackEvent('payment_completed', {
              product: verifiedProductId,
              product_id: verifiedProductId,
              value: verifiedValue,
              currency: 'CAD',
              sessionId,
              caseId: data.caseId || caseId,
              verifiedByServer: true,
            });
          }
        } else if (data?.alreadyUnlocked) {
          // Already processed by webhook - just mark as verified
          setVerified(true);
          trackEvent('payment_already_verified', { caseId, sessionId, product: productKey });
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
  }, [sessionId, caseId, productKey]);

  const handleUploadEvidence = () => {
    trackEvent('evidence_upload_started', { caseId, source: 'next_steps' });
    if (caseId) {
      navigate(`/evidence?case=${caseId}`);
    } else {
      navigate('/evidence');
    }
  };

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

  const steps: Step[] = [
    { id: 'intake', label: 'Intake completed', status: 'complete', icon: 'check' },
    { id: 'unlocked', label: 'Document preparation unlocked', status: 'complete', icon: 'unlock' },
    { id: 'upload', label: 'Upload evidence', status: 'current', icon: 'upload' },
    { id: 'generate', label: 'Generate documents', status: 'upcoming', icon: 'generate' },
    { id: 'download', label: 'Download & file', status: 'upcoming', icon: 'download' },
  ];

  const getStepIcon = (step: Step) => {
    if (step.status === 'complete') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (step.status === 'current') {
      return (
        <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
      );
    }
    return <Circle className="h-5 w-5 text-muted-foreground/40" />;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              You're all set. Let's prepare your documents.
            </h1>
            <p className="text-muted-foreground">
              Your one-time payment unlocked document preparation for this case.
            </p>
          </div>

          {/* Progress Checklist */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      step.status === 'current'
                        ? 'bg-primary/5 border border-primary/20'
                        : step.status === 'complete'
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex-shrink-0">{getStepIcon(step)}</div>
                    <span
                      className={`font-medium ${
                        step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {step.status === 'complete' && step.icon === 'check' && '✅ '}
                      {step.status === 'complete' && step.icon === 'unlock' && '🔓 '}
                      {step.status === 'current' && '🔄 '}
                      {step.status === 'upcoming' && step.icon === 'generate' && '⏳ '}
                      {step.status === 'upcoming' && step.icon === 'download' && '📄 '}
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Primary CTA */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white"
              onClick={handleUploadEvidence}
            >
              Upload My Evidence
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground">
              You can upload documents now or come back later.<br />
              Your progress is saved automatically.
            </p>
          </div>

          {/* Legal Clarity Footer */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Justice-Bot helps you prepare documents and understand procedure.<br />
              It does not provide legal advice or representation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
