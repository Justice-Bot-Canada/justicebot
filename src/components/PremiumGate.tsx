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
            <Gift className="w-5 h-5 text-green-500" />
            Free Access Available!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Sign up now and get FREE access - limited to first 800 users
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="bg-green-600 hover:bg-green-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Sign Up for FREE
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasAccess) {
    return (
      <div>
        {isFreeUser && userNumber && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Gift className="w-4 h-4" />
              <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                FREE User #{userNumber}
              </Badge>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              You're one of the first 800 users with lifetime free access!
            </p>
          </div>
        )}
        {children}
      </div>
    );
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