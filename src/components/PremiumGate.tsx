import { ReactNode } from 'react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Sparkles, Check } from 'lucide-react';
import PayPalTrialButton from '@/components/PayPalTrialButton';

// PayPal plan ID with 5-day trial
const PAYPAL_TRIAL_PLAN_ID = "P-2GT19989129104740NFBBDVY";

interface PremiumGateProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export const PremiumGate = ({ children, feature, fallback, showUpgrade = true }: PremiumGateProps) => {
  const { user } = useAuth();
  const { hasAccess, isFreeUser, userNumber, loading } = usePremiumAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            Sign In Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Sign in to access premium features
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="bg-primary hover:bg-primary/90"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            Premium Feature
          </CardTitle>
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            5 Days Free
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            <strong>{feature}</strong> is a premium feature.
          </p>
          <div className="space-y-2 text-sm text-left">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Professional PDF generation
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Smart form pre-filling
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Priority support
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Advanced case tracking
            </p>
          </div>
        </div>
        
        {showUpgrade && (
          <div className="space-y-3 pt-2">
            <PayPalTrialButton planId={PAYPAL_TRIAL_PLAN_ID} trialDays={5} />
            <div className="text-center text-xs text-muted-foreground">
              No charge for 5 days. Cancel anytime.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};