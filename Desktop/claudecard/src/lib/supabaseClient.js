import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const initialHash      = typeof window !== 'undefined' ? window.location.hash : '';
export const initialSearch    = typeof window !== 'undefined' ? window.location.search : '';
export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',           // works with both hash and code-based redirects
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  : null;

// Capture PASSWORD_RECOVERY event at module level — before React mounts
// so we never miss it even if it fires during code exchange
export let pendingRecovery = false;

if (supabase) {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') pendingRecovery = true;
  });
}

export const SITE_KEY  = import.meta.env.VITE_SITE_KEY  || 'claudecard';
export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Claude Card';
