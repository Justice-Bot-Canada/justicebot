import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Gift, Lock } from 'lucide-react';

export const PremiumStatusBanner = () => {
  const { user } = useAuth();
  const { hasAccess, isPremium, isFreeUser, userNumber, loading } = usePremiumAccess();

  if (loading || !user) return null;

  if (hasAccess) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isFreeUser ? (
              <>
                <Gift className="w-4 h-4 text-green-600" />
                <Badge variant="outline" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                  FREE User #{userNumber} / 800
                </Badge>
                <span className="text-sm text-green-700 dark:text-green-300">
                  Lifetime free access!
                </span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 text-amber-600" />
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
                  Premium Active
                </Badge>
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  All features unlocked
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-700 dark:text-amber-300">
            Limited access - Upgrade for full features
          </span>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.location.href = '/pricing'}
          className="border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          <Crown className="w-3 h-3 mr-1" />
          Upgrade
        </Button>
      </div>
    </div>
  );
};