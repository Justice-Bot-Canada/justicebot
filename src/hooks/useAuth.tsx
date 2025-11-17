import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[useAuth] Setting up auth listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[useAuth] Auth state changed:', event, { hasSession: !!session });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    console.log('[useAuth] Checking for existing session');
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('[useAuth] Auth session error:', error);
        }
        console.log('[useAuth] Got session:', { hasSession: !!session });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[useAuth] Failed to get session:', err);
        setLoading(false);
      });

    return () => {
      console.log('[useAuth] Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
}