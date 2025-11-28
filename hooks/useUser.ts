/**
 * useUser Hook
 * Get current authenticated user with profile and role
 */

'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { getUserProfile, getUserRole } from '@/lib/supabase/queries';
import type { UserProfile, UserRole } from '@/types';

interface UseUserReturn {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('client');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Fetch profile and role
        Promise.all([
          getUserProfile(user.id),
          getUserRole(user.id),
        ]).then(([userProfile, userRole]) => {
          setProfile(userProfile);
          setRole(userRole as UserRole);
          setIsLoading(false);
        }).catch(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        Promise.all([
          getUserProfile(session.user.id),
          getUserRole(session.user.id),
        ]).then(([userProfile, userRole]) => {
          setProfile(userProfile);
          setRole(userRole as UserRole);
        });
      } else {
        setProfile(null);
        setRole('client');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    role,
    isLoading,
    isAuthenticated: !!user,
  };
}
