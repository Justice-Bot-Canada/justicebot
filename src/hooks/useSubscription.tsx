import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface SubscriptionStatus {
  subscribed: boolean;
  plan: string | null;
  subscriptionEnd: string | null;
  subscriptionId: string | null;
  priceId: string | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    plan: null,
    subscriptionEnd: null,
    subscriptionId: null,
    priceId: null,
    loading: true,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false, subscribed: false }));
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;

      setStatus({
        subscribed: data.subscribed || false,
        plan: data.plan || null,
        subscriptionEnd: data.subscriptionEnd || null,
        subscriptionId: data.subscriptionId || null,
        priceId: data.priceId || null,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error checking subscription:", err);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to check subscription",
      }));
    }
  }, [user]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Error opening customer portal:", err);
      throw err;
    }
  };

  const startCheckout = async (priceId: string, planName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, planName },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
      return data;
    } catch (err) {
      console.error("Error starting checkout:", err);
      throw err;
    }
  };

  return {
    ...status,
    checkSubscription,
    openCustomerPortal,
    startCheckout,
  };
}
