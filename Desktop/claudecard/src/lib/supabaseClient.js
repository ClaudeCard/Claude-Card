import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'implicit',      // hash-based — works across any browser/email client
        detectSessionInUrl: true,  // auto-process #access_token= on page load
        persistSession: true,
      },
    })
  : null;

export const SITE_KEY  = import.meta.env.VITE_SITE_KEY  || 'claudecard';
export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Claude Card';
