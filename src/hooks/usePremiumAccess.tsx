import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface PremiumAccess {
  hasAccess: boolean;
  isPremium: boolean;
  isFreeUser: boolean;
  loading: boolean;
  userNumber?: number;
  refetch: () => Promise<void>;
}

export function usePremiumAccess(): PremiumAccess {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isFreeUser, setIsFreeUser] = useState(false);
  const [userNumber, setUserNumber] = useState<number>();
  const [loading, setLoading] = useState(true);

  const checkAccess = async () => {
    if (!user) {
      setIsPremium(false);
      setIsFreeUser(false);
      setUserNumber(undefined);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Check premium entitlements
      const { data: entitlements } = await supabase
        .from('entitlements')
        .select('product_id')
        .eq('user_id', user.id);

      setIsPremium(entitlements && entitlements.length > 0);

      // Check free tier eligibility
      const { data: freeEligible, error } = await supabase.rpc('check_free_tier_eligibility');
      if (error) throw error;
      setIsFreeUser(freeEligible === true);

      // Get user number for display
      const { data: caseData } = await supabase
        .from('cases')
        .select('user_number')
        .eq('user_id', user.id)
        .not('user_number', 'is', null)
        .limit(1)
        .single();

      if (caseData?.user_number) {
        setUserNumber(caseData.user_number);
      }
    } catch (error) {
      console.error('Error checking premium access:', error);
      setIsPremium(false);
      setIsFreeUser(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [user]);

  const hasAccess = isPremium || isFreeUser;

  return {
    hasAccess,
    isPremium,
    isFreeUser,
    loading,
    userNumber,
    refetch: checkAccess,
  };
}