import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Gift, Lock, Shield } from 'lucide-react';

export const PremiumStatusBanner = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const { hasAccess, isPremium, isFreeUser, userNumber, loading } = usePremiumAccess();

  if (loading || roleLoading || !user) return null;

  // Don't show banner for admins
  if (isAdmin) {
    return (
      <div className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-600" />
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
              Admin Access
            </Badge>
            <span className="text-sm text-purple-700 dark:text-purple-300">
              Full system access
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (hasAccess && isPremium) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-600" />
            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
              Premium Active
            </Badge>
            <span className="text-sm text-amber-700 dark:text-amber-300">
              All features unlocked
            </span>
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