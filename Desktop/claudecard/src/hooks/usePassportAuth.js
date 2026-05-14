import { useState, useEffect, useCallback } from 'react';
import { supabase, hasSupabaseConfig, SITE_KEY, SITE_NAME } from '../lib/supabaseClient';

/**
 * Shared Ridiculous Passport auth hook.
 * Handles session, join_site_membership, and sign-out consistently.
 */
export function usePassportAuth({ onSignIn, onSignOut } = {}) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const joinMembership = useCallback(async () => {
    if (!supabase) return;
    try {
      await supabase.rpc('join_site_membership', {
        p_site_key:  SITE_KEY,
        p_site_name: SITE_NAME,
      });
    } catch {}
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig) { setLoading(false); return; }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) { joinMembership(); onSignIn?.(u); }
      else onSignOut?.();
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) { joinMembership(); onSignIn?.(u); }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [joinMembership]);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setUser(null);
    onSignOut?.();
  }, []);

  return { user, loading, signOut, isAuthenticated: !!user };
}
