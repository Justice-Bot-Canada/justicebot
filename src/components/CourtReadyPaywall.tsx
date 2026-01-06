import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useShouldHidePricing } from '@/components/ProgramBanner';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast-stub';
import { trackEvent } from '@/utils/analytics';
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
  onAccessGranted?: () => void;
}

const STRIPE_PRICE_ID = 'price_1SmUwAL0pLShFbLtIK429fdX'; // $39 CAD one-time

export function CourtReadyPaywall({ triageData, onAccessGranted }: CourtReadyPaywallProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isProgramUser, loading: accessLoading } = usePremiumAccess();
  const shouldHidePricing = useShouldHidePricing();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Track paywall view
  useEffect(() => {
    if (!accessLoading && !hasAccess && !isProgramUser && !shouldHidePricing) {
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

  // If user has access (paid or program), skip paywall
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
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          priceId: STRIPE_PRICE_ID,
          mode: 'payment',
          successUrl: `${window.location.origin}/documents-unlocked?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/triage`,
          metadata: {
            product: 'court_ready_pack',
            plan_key: 'court_ready_pack',
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
    {
      icon: ClipboardList,
      title: 'Guided Legal Triage',
      description: 'AI identifies your legal pathway and required forms',
    },
    {
      icon: Upload,
      title: 'Evidence Upload & Organization',
      description: 'Securely store and organize all your documents',
    },
    {
      icon: BookOpen,
      title: 'Auto-Organized Book of Documents',
      description: 'Tribunal-ready document bundle with proper formatting',
    },
    {
      icon: FileCheck,
      title: 'Form Generation',
      description: 'Pre-filled court and tribunal forms ready for filing',
    },
    {
      icon: MapPin,
      title: 'Step-by-Step Filing Instructions',
      description: 'Exactly where, when, and how to file your documents',
    },
  ];

  return (
    <>
      <Card className="max-w-2xl mx-auto border-primary/30 shadow-lg">
        <CardHeader className="text-center pb-4">
          <Badge className="w-fit mx-auto mb-3 bg-primary/10 text-primary border-primary/20">
            One-Time Purchase
          </Badge>
          <CardTitle className="text-2xl md:text-3xl">
            Court-Ready Document Pack
          </CardTitle>
          <CardDescription className="text-base">
            Everything you need to file correctly — prepared and organized for submission
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Pricing */}
          <div className="text-center space-y-2">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold">$39</span>
              <span className="text-muted-foreground">CAD</span>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              One-time payment. No subscription. No ongoing charges.
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            size="lg"
            className="w-full text-lg py-6"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-5 w-5" />
                Generate My Court-Ready Documents
              </>
            )}
          </Button>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span>Stripe protected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Instant access</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={(open) => {
          setShowAuthDialog(open);
          // After dialog closes and user is now authenticated, try purchase
          if (!open) {
            setTimeout(() => {
              // Re-check auth state after dialog closes
              handlePurchase();
            }, 500);
          }
        }}
      />
    </>
  );
}
