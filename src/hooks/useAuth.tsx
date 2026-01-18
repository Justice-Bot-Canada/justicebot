import { useState, useEffect, useRef } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/utils/analytics';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const authEventFired = useRef<string | null>(null);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Fire GA4 events for auth state changes - prevent duplicates
        if (session?.user && authEventFired.current !== session.user.id) {
          authEventFired.current = session.user.id;
          
          const provider = session.user.app_metadata?.provider || 'email';
          
          if (event === 'SIGNED_IN') {
            // Fire GA4 login event
            analytics.loginGA4(provider);
          } else if (event === 'USER_UPDATED' && session.user.email_confirmed_at) {
            // Email verified - this is signup completion for email confirmation flow
            analytics.signupCompletedGA4(provider);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
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