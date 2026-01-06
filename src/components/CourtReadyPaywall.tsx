import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShouldHidePricing } from '@/components/ProgramBanner';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { trackEvent, analytics } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AuthDialog from '@/components/AuthDialog';
import {
  FileCheck,
  Upload,
  BookOpen,
  ClipboardList,
  MapPin,
  CheckCircle,
  Loader2,
  Shield,
  CreditCard,
} from 'lucide-react';

interface CourtReadyPaywallProps {
  triageData?: {
    venue: string;
    venueTitle: string;
    province: string;
    description: string;
  };
  caseId?: string | null;
  onAccessGranted?: () => void;
  onCaseCreated?: (caseId: string) => void;
}

const STRIPE_PRICE_ID = 'price_1SmUwAL0pLShFbLtIK429fdX'; // $39 CAD one-time

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
      // Track with new funnel event
      analytics.paywallViewed(triageData?.venue, 0);
      
      // Legacy event for backwards compatibility
      trackEvent('paywall_viewed', {
        location: 'post_triage',
        venue: triageData?.venue,
      });
    }
  }, [accessLoading, hasAccess, isProgramUser, shouldHidePricing, triageData?.venue]);

  // If user has access (paid or program), auto-grant
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
    trackEvent('payment_initiated', {
      product: 'court_ready_pack',
      price: 39,
      currency: 'CAD',
    });

    try {
      // Create case if we don't have one yet
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

      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
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

  const benefits = [
    'Guided legal triage based on your situation',
    'Secure evidence upload and organization',
    'Automatically formatted Book of Documents',
    'Correct tribunal or court forms selected for you',
    'Step-by-step filing instructions',
  ];

  return (
    <>
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-3">
          Prepare Your Court-Ready Documents
        </h1>
        
        {/* Subheading */}
        <p className="text-center text-muted-foreground mb-8">
          You're almost finished. To generate your filing-ready documents, complete the one-time payment below.
        </p>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 space-y-6">
            {/* What You Get */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">What You Get</h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Divider Text */}
            <p className="text-sm text-muted-foreground text-center">
              This prepares your documents for submission.<br />
              It does not provide legal advice or representation.
            </p>

            <Separator />

            {/* Price Block */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">One-Time Payment</p>
              <p className="text-4xl font-bold text-foreground">$39</p>
              <p className="text-sm text-muted-foreground">
                No subscriptions. No recurring charges.
              </p>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
              size="lg"
              className="w-full text-base py-6 bg-slate-800 hover:bg-slate-900 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate My Court-Ready Documents'
              )}
            </Button>

            {/* Under-Button Assurance */}
            <p className="text-xs text-muted-foreground text-center">
              Your payment unlocks document generation for this case only.
            </p>

            {/* Optional Micro-Copy */}
            <p className="text-xs text-muted-foreground text-center">
              Most users complete their documents in under 30 minutes.
            </p>

            <Separator />

            {/* Trust & Reassurance */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Your information is private and secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileCheck className="h-4 w-4 text-green-600" />
                <span>Documents are generated specifically for your case</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClipboardList className="h-4 w-4 text-green-600" />
                <span>You keep full control over what you file and when</span>
              </div>
            </div>

            <Separator />

            {/* Legal Clarity Footer */}
            <p className="text-xs text-muted-foreground text-center">
              Justice-Bot helps you prepare documents and understand procedure.<br />
              It does not provide legal advice or replace a lawyer.
            </p>
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
