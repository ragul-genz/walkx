import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Determines whether the frontend is connected to a live, production Supabase backend
 * or is running in local interactive sandbox / demonstration mode.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseUrl.startsWith('https://')
);

/**
 * Singleton Supabase Client instance with automatic token refreshing,
 * local storage session persistence, and URL hash recovery.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: 'walkx-auth-session'
      }
    })
  : null;

/**
 * Backend Connection Diagnostic Information
 */
export const getSupabaseConfigStatus = () => {
  return {
    isLive: isSupabaseConfigured,
    url: isSupabaseConfigured ? supabaseUrl.replace(/https:\/\/(.{4}).*(\..*)/, 'https://$1...$2') : 'Not Configured',
    mode: isSupabaseConfigured ? ('Live Production Supabase' as const) : ('Interactive Demo Sandbox' as const)
  };
};
