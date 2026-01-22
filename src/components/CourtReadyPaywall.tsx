import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShouldHidePricing } from '@/components/ProgramBanner';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { trackEvent, analytics } from '@/utils/analytics';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AuthDialog from '@/components/AuthDialog';
import { Loader2 } from 'lucide-react';
import { BeforeYouPayExplanation } from '@/components/BeforeYouPayExplanation';
import { UnlockButton } from '@/components/UnlockButton';
import { PaymentTrustSignals, LegalDisclaimer } from '@/components/PaymentTrustSignals';
import { ValuePreview } from '@/components/ValuePreview';

interface CourtReadyPaywallProps {
  triageData?: {
    venue: string;
    venueTitle: string;
    province: string;
    description: string;
    recommendedForms?: Array<{ formCode: string; formTitle: string }>;
  };
  caseId?: string | null;
  onAccessGranted?: () => void;
  onCaseCreated?: (caseId: string) => void;
}

const STRIPE_PRICE_ID = 'price_1SmUwAL0pLShFbLtIK429fdX'; // $39 CAD one-time

// Default document structure and filing steps for preview
const getDocumentStructure = (venue: string) => {
  const structures: Record<string, string[]> = {
    ltb: [
      "Application form with your details",
      "Statement of facts and timeline",
      "Evidence list and exhibit tabs",
      "Service instructions for landlord",
      "Filing checklist"
    ],
    hrto: [
      "Form 1 Application",
      "Chronology of events",
      "Grounds for discrimination",
      "Remedies sought section",
      "Evidence organization guide"
    ],
    "small-claims": [
      "Plaintiff's Claim form",
      "Statement of claim details",
      "Damages calculation sheet",
      "Evidence list",
      "Service requirements"
    ],
    default: [
      "Application form for your case",
      "Statement of facts",
      "Evidence organization",
      "Filing instructions",
      "Next steps checklist"
    ]
  };
  return structures[venue] || structures.default;
};

const getFilingSteps = (venue: string) => {
  const steps: Record<string, string[]> = {
    ltb: [
      "Complete your application with pre-filled details",
      "Organize your evidence with exhibit tabs",
      "File online or in person at the LTB",
      "Serve the other party within required timeframe",
      "Prepare for your hearing date"
    ],
    hrto: [
      "Complete Form 1 with your case details",
      "Attach supporting documentation",
      "Submit to the Human Rights Tribunal",
      "Serve the respondent(s)",
      "Await case management direction"
    ],
    default: [
      "Complete your application form",
      "Gather and organize evidence",
      "File with the appropriate court/tribunal",
      "Serve required parties",
      "Prepare for next steps"
    ]
  };
  return steps[venue] || steps.default;
};

export function CourtReadyPaywall({ triageData, caseId, onAccessGranted, onCaseCreated }: CourtReadyPaywallProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isProgramUser, loading: accessLoading } = usePremiumAccess();
  const shouldHidePricing = useShouldHidePricing();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Track paywall view
  useEffect(() => {
    if (!accessLoading && !hasAccess && !isProgramUser && !shouldHidePricing) {
      analytics.paywallViewed(triageData?.venue, 0);
      trackEvent('paywall_viewed', {
        location: 'post_triage',
        venue: triageData?.venue,
      });
    }
  }, [accessLoading, hasAccess, isProgramUser, shouldHidePricing, triageData?.venue]);

  // If user has access, auto-grant
  useEffect(() => {
    if (!accessLoading && (hasAccess || isProgramUser || shouldHidePricing)) {
      onAccessGranted?.();
    }
  }, [accessLoading, hasAccess, isProgramUser, shouldHidePricing, onAccessGranted]);

  if (accessLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasAccess || isProgramUser || shouldHidePricing) {
    return null;
  }

  const handlePurchase = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsProcessing(true);
    
    trackEvent('checkout_initiated', {
      product: 'court_ready_pack',
      price: 39,
      currency: 'CAD',
    });
    analytics.beginCheckout('court_ready_pack', 'Court-Ready Document Pack', 39);

    try {
      let finalCaseId = caseId;
      if (!finalCaseId && triageData) {
        const { data: newCase, error: caseError } = await supabase
          .from('cases')
          .insert({
            user_id: user.id,
            title: `${triageData.venueTitle || triageData.venue} Case`,
            description: triageData.description,
            venue: triageData.venue,
            province: triageData.province,
            status: 'pending',
            flow_step: 'payment',
            triage: {
              venue: triageData.venue,
              venueTitle: triageData.venueTitle,
              province: triageData.province,
            } as any,
          })
          .select()
          .single();

        if (caseError) throw caseError;
        finalCaseId = newCase.id;
        onCaseCreated?.(newCase.id);
      }

      const { data, error } = await supabase.functions.invoke('create_checkout', {
        body: {
          priceId: STRIPE_PRICE_ID,
          mode: 'payment',
          caseId: finalCaseId,
          successUrl: `${window.location.origin}/case/${finalCaseId}/next-steps?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/triage`,
          metadata: {
            product: 'court_ready_pack',
            plan_key: 'court_ready_pack',
            case_id: finalCaseId,
            venue: triageData?.venue || 'unknown',
            province: triageData?.province || 'unknown',
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Unable to start payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const venue = triageData?.venue || 'default';
  const venueTitle = triageData?.venueTitle || 'Your Legal Case';
  const primaryForm = triageData?.recommendedForms?.[0];

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Step 1: Show the VALUE first - what we identified */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-2">Based on your situation</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            We've identified your legal path
          </h1>
        </div>

        {/* Value Preview - Shows what they're getting BEFORE payment */}
        <ValuePreview
          venue={venue}
          venueTitle={venueTitle}
          formCode={primaryForm?.formCode}
          formName={primaryForm?.formTitle}
          documentStructure={getDocumentStructure(venue)}
          filingSteps={getFilingSteps(venue)}
        />

        {/* Step 2: Payment Card - Only AFTER value is shown */}
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 space-y-5">
            {/* Before You Pay Explanation */}
            <BeforeYouPayExplanation
              productName="Court-Ready Document Package"
              whyItMatters="Filing the wrong form or missing steps can delay or harm your case"
              problemItSolves="We prepare the correct forms with your details already filled in"
              immediateDeliverable="Download your complete document package, ready to file"
              venue={venueTitle}
            />

            <Separator />

            {/* Price - Clear and simple */}
            <div className="text-center space-y-1">
              <p className="text-4xl font-bold text-foreground">$39</p>
              <p className="text-sm text-muted-foreground">
                One-time payment • Instant access
              </p>
            </div>

            {/* Unlock Button - NOT "Buy" or "Purchase" */}
            <UnlockButton
              unlockLabel="Your Documents"
              price="$39"
              isLoading={isProcessing}
              onClick={handlePurchase}
              showArrow={true}
            />

            {/* Trust Signals */}
            <PaymentTrustSignals 
              variant="minimal" 
              showCanadianBuilt={false}
            />

            <Separator />

            {/* Legal Disclaimer - Required */}
            <LegalDisclaimer />
          </CardContent>
        </Card>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={(open) => {
          setShowAuthDialog(open);
          if (!open) {
            setTimeout(() => {
              handlePurchase();
            }, 500);
          }
        }}
      />
    </>
  );
}
