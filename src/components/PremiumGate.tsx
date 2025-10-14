import { ReactNode } from 'react';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Gift, Users } from 'lucide-react';

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
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-500" />
          Premium Feature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            <strong>{feature}</strong> is a premium feature.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✨ Professional PDF generation</p>
            <p>🤖 Smart form pre-filling</p>
            <p>🏆 Priority support</p>
            <p>📊 Advanced case tracking</p>
          </div>
        </div>
        
        {showUpgrade && (
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/pricing'} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              Starting at $9.99/month or $2.99/month for low-income applicants
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};