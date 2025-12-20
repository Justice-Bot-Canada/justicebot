import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';

export interface PremiumAccess {
  hasAccess: boolean;
  isPremium: boolean;
  isFreeUser: boolean;
  loading: boolean;
  userNumber?: number;
  tier: 'free' | 'low-income' | 'monthly' | 'yearly' | null;
  hasSettlementCalculator: boolean;
  refetch: () => Promise<void>;
}

export function usePremiumAccess(): PremiumAccess {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const [isPremium, setIsPremium] = useState(false);
  const [isFreeUser, setIsFreeUser] = useState(false);
  const [userNumber, setUserNumber] = useState<number>();
  const [tier, setTier] = useState<'free' | 'low-income' | 'monthly' | 'yearly' | null>(null);
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

      const hasPremium = entitlements && entitlements.length > 0;
      setIsPremium(hasPremium);
      
      // Determine tier based on product_id
      if (hasPremium && entitlements[0]?.product_id) {
        const productId = entitlements[0].product_id.toLowerCase();
        if (productId.includes('yearly') || productId.includes('annual')) {
          setTier('yearly');
        } else if (productId.includes('monthly')) {
          setTier('monthly');
        } else if (productId.includes('low-income') || productId.includes('lowincome')) {
          setTier('low-income');
        } else {
          setTier('monthly'); // Default to monthly for unrecognized premium tiers
        }
      } else {
        setTier(null);
      }

      // Check free tier eligibility
      const { data: freeEligible, error } = await supabase.rpc('check_free_tier_eligibility');
      if (error) throw error;
      setIsFreeUser(freeEligible === true);

      // Get user signup number for display (first 200 get free access)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('signup_number')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData && 'signup_number' in profileData) {
        setUserNumber(profileData.signup_number as number);
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
    if (!roleLoading) {
      checkAccess();
    }
  }, [user?.id, roleLoading]); // Wait for role to load before checking access

  // Grant full access to admins automatically
  const hasAccess = isAdmin || isPremium || isFreeUser;
  
  // Settlement Calculator is only available for Monthly and Yearly tiers
  const hasSettlementCalculator = isAdmin || tier === 'monthly' || tier === 'yearly';

  return {
    hasAccess,
    isPremium: isAdmin || isPremium, // Admins treated as premium
    isFreeUser,
    loading: loading || roleLoading,
    userNumber,
    tier: isAdmin ? 'yearly' : tier, // Admins get highest tier
    hasSettlementCalculator,
    refetch: checkAccess,
  };
}