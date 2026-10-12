import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role?: 'user' | 'admin' | 'moderator';
  } | null;
  error?: string;
  isDemoSandbox?: boolean;
}

// Demo sandbox accounts for initial UI prototype testing
export const DEMO_CREDENTIALS = {
  user: {
    email: 'walker@walkx.app',
    password: 'Password123!',
    name: 'Priya Sharma',
    phone: '+91 98765 43210'
  },
  admin: {
    email: 'admin@walkx.app',
    secretKey: 'AdminSecret2026!',
    name: 'Chief Security Officer'
  }
};

/**
 * Sign In User with Email & Password
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();

  // If live Supabase connection is configured, use real Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (error) {
        return { success: false, error: error.message, isDemoSandbox: false };
      }

      const userMetadata = data.user?.user_metadata || {};
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: userMetadata.full_name || 'Walker',
          phone: userMetadata.phone || '',
          role: 'user'
        },
        isDemoSandbox: false
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Supabase authentication failed.', isDemoSandbox: false };
    }
  }

  // --- DEMO PROTOTYPE SANDBOX MODE ---
  // Accepts demo credentials or any validly formatted credentials in test sandbox
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.', isDemoSandbox: true };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.', isDemoSandbox: true };
  }

  // Check demo credentials or allow sandbox walker sign-in
  const isDefaultDemo = cleanEmail === DEMO_CREDENTIALS.user.email.toLowerCase();
  const userName = isDefaultDemo ? DEMO_CREDENTIALS.user.name : cleanEmail.split('@')[0].replace(/[._]/g, ' ');

  // Save session to localStorage for prototype persistence
  localStorage.setItem('walkx_demo_user', JSON.stringify({
    id: `u_${Date.now()}`,
    email: cleanEmail,
    name: userName,
    phone: isDefaultDemo ? DEMO_CREDENTIALS.user.phone : '+91 98765 43210',
    role: 'user'
  }));

  return {
    success: true,
    user: {
      id: `u_${Date.now()}`,
      email: cleanEmail,
      name: userName,
      phone: isDefaultDemo ? DEMO_CREDENTIALS.user.phone : '+91 98765 43210',
      role: 'user'
    },
    isDemoSandbox: true
  };
}

/**
 * Register New User
 */
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone: string
): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();
  const cleanPhone = phone.trim();

  // If live Supabase connection is configured, use real Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone
          }
        }
      });

      if (error) {
        return { success: false, error: error.message, isDemoSandbox: false };
      }

      return {
        success: true,
        user: {
          id: data.user?.id || `u_${Date.now()}`,
          email: data.user?.email || cleanEmail,
          name: cleanName,
          phone: cleanPhone,
          role: 'user'
        },
        isDemoSandbox: false
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Supabase registration failed.', isDemoSandbox: false };
    }
  }

  // --- DEMO PROTOTYPE SANDBOX MODE ---
  localStorage.setItem('walkx_demo_user', JSON.stringify({
    id: `u_${Date.now()}`,
    email: cleanEmail,
    name: cleanName,
    phone: cleanPhone,
    role: 'user'
  }));

  return {
    success: true,
    user: {
      id: `u_${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      role: 'user'
    },
    isDemoSandbox: true
  };
}

/**
 * Request Password Reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string; isDemoSandbox: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) {
        return { success: false, error: error.message, isDemoSandbox: false };
      }
      return { success: true, isDemoSandbox: false };
    } catch (err: any) {
      return { success: false, error: err.message, isDemoSandbox: false };
    }
  }

  // Demo Prototype Sandbox: simulate email dispatch
  return { success: true, isDemoSandbox: true };
}

/**
 * Sign Out
 */
export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }
  localStorage.removeItem('walkx_demo_user');
  localStorage.removeItem('walkx_admin_session');
}

/**
 * Separate Administrative Authentication
 * SECURITY NOTICE:
 * Client-side role checks are NEVER a substitute for secure server-side admin authorization.
 * In production Supabase architectures:
 * 1. Admin access must be validated via PostgreSQL Row Level Security (RLS) policies.
 * 2. User claims must be verified via `app_metadata.role === 'admin'` signed by Supabase Auth JWT.
 * 3. Administrative tables must deny public access by default.
 */
export async function adminLogin(email: string, secretKey: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();

  // In production Supabase setup:
  // Must authenticate with Supabase, then verify `raw_app_meta_data.role === 'admin'` or dedicated `admin_profiles` table
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: secretKey
      });

      if (error) {
        return { success: false, error: error.message, isDemoSandbox: false };
      }

      const role = data.user.app_metadata?.role;
      if (role !== 'admin' && role !== 'moderator') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access Denied: Account lacks verified administrative authorization (RLS policy check failed).',
          isDemoSandbox: false
        };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: data.user.user_metadata?.full_name || 'Administrator',
          role: 'admin'
        },
        isDemoSandbox: false
      };
    } catch (err: any) {
      return { success: false, error: err.message, isDemoSandbox: false };
    }
  }

  // --- DEMO PROTOTYPE SANDBOX MODE ---
  // In demo sandbox, enforce demo key check with clear security boundary messaging
  const isMatch =
    cleanEmail === DEMO_CREDENTIALS.admin.email.toLowerCase() &&
    secretKey === DEMO_CREDENTIALS.admin.secretKey;

  if (!isMatch) {
    return {
      success: false,
      error: 'Invalid Administrator credentials. In Demo Sandbox mode, use admin@walkx.app / AdminSecret2026!',
      isDemoSandbox: true
    };
  }

  localStorage.setItem('walkx_admin_session', JSON.stringify({
    authenticatedAt: Date.now(),
    role: 'admin',
    email: cleanEmail
  }));

  return {
    success: true,
    user: {
      id: 'adm_root',
      email: cleanEmail,
      name: DEMO_CREDENTIALS.admin.name,
      role: 'admin'
    },
    isDemoSandbox: true
  };
}
