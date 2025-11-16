import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'moderator' | 'user';

export function useRole() {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserRoles();
    } else {
      setUserRoles([]);
      setLoading(false);
    }
  }, [user?.id]); // Only re-fetch when user ID changes

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id);

      if (error) {
        setUserRoles([]);
      } else {
        const roles = data?.map(r => r.role as UserRole) || [];
        setUserRoles(roles);
      }
    } catch (error) {
      setUserRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const isAdmin = hasRole('admin');
  const isModerator = hasRole('moderator');

  return {
    userRoles,
    hasRole,
    isAdmin,
    isModerator,
    loading,
    refetch: fetchUserRoles
  };
}