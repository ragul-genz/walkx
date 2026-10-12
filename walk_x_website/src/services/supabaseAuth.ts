import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserProfile } from '../types';

export { isSupabaseConfigured, supabase };

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role?: 'user' | 'admin' | 'moderator';
    pointsBalance?: number;
    totalSteps?: number;
    streakDays?: number;
    emailConfirmed?: boolean;
  } | null;
  session?: Session | null;
  error?: string;
  isDemoSandbox: boolean;
  requiresEmailConfirmation?: boolean;
}

// Built-in Demo Credentials for sandbox testing when backend is unconfigured
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

  // 1. Live Supabase Backend Flow
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (error) {
        // Helpful error hint for unconfirmed email
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            error: 'Email address not verified. Please check your inbox for the confirmation link.',
            requiresEmailConfirmation: true,
            isDemoSandbox: false
          };
        }
        return { success: false, error: error.message, isDemoSandbox: false };
      }

      if (!data.user) {
        return { success: false, error: 'User account not found.', isDemoSandbox: false };
      }

      // Fetch extended application profile from public.profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userName = profile?.full_name || data.user.user_metadata?.full_name || 'Walker';
      const userPhone = profile?.phone || data.user.user_metadata?.phone || '';
      const userRole = profile?.role || (data.user.app_metadata?.role as any) || 'user';

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: userName,
          phone: userPhone,
          role: userRole,
          pointsBalance: profile?.points_balance ?? 1000,
          totalSteps: profile?.total_steps ?? 0,
          streakDays: profile?.streak_days ?? 1,
          emailConfirmed: Boolean(data.user.email_confirmed_at)
        },
        session: data.session,
        isDemoSandbox: false
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Supabase authentication failed.', isDemoSandbox: false };
    }
  }

  // 2. Demo Sandbox Fallback
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.', isDemoSandbox: true };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.', isDemoSandbox: true };
  }

  const isDefaultDemo = cleanEmail === DEMO_CREDENTIALS.user.email.toLowerCase();
  const userName = isDefaultDemo ? DEMO_CREDENTIALS.user.name : cleanEmail.split('@')[0].replace(/[._]/g, ' ');

  const sandboxUser = {
    id: `u_${Date.now()}`,
    email: cleanEmail,
    name: userName,
    phone: isDefaultDemo ? DEMO_CREDENTIALS.user.phone : '+91 98765 43210',
    role: 'user' as const,
    pointsBalance: 12500,
    totalSteps: 18450,
    streakDays: 7,
    emailConfirmed: true
  };

  localStorage.setItem('walkx_demo_user', JSON.stringify(sandboxUser));

  return {
    success: true,
    user: sandboxUser,
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

  // 1. Live Supabase Backend Flow
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone
          },
          emailRedirectTo: `${window.location.origin}/#login`
        }
      });

      if (error) {
        return { success: false, error: error.message, isDemoSandbox: false };
      }

      if (!data.user) {
        return { success: false, error: 'Registration could not be completed.', isDemoSandbox: false };
      }

      // Check if email confirmation is required by project settings
      const requiresConfirmation = !data.session && !data.user.email_confirmed_at;

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: cleanName,
          phone: cleanPhone,
          role: 'user',
          pointsBalance: 1000, // Onboarding bonus from database trigger
          totalSteps: 0,
          streakDays: 1,
          emailConfirmed: Boolean(data.user.email_confirmed_at)
        },
        session: data.session,
        requiresEmailConfirmation: requiresConfirmation,
        isDemoSandbox: false
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Supabase registration failed.', isDemoSandbox: false };
    }
  }

  // 2. Demo Sandbox Fallback
  const sandboxUser = {
    id: `u_${Date.now()}`,
    email: cleanEmail,
    name: cleanName,
    phone: cleanPhone,
    role: 'user' as const,
    pointsBalance: 1000,
    totalSteps: 0,
    streakDays: 1,
    emailConfirmed: true
  };

  localStorage.setItem('walkx_demo_user', JSON.stringify(sandboxUser));

  return {
    success: true,
    user: sandboxUser,
    isDemoSandbox: true
  };
}

/**
 * Request Password Reset Email
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: string; isDemoSandbox: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/#reset-password`
      });

      if (error) {
        return { success: false, error: error.message, isDemoSandbox: false };
      }
      return { success: true, isDemoSandbox: false };
    } catch (err: any) {
      return { success: false, error: err.message, isDemoSandbox: false };
    }
  }

  return { success: true, isDemoSandbox: true };
}

/**
 * Update Password (for authenticated reset password flow)
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return { success: true };
}

/**
 * Get Current Active Session & Profile from Supabase
 */
export async function getCurrentAuthUser(): Promise<{
  user: User | null;
  profile: Partial<UserProfile> | null;
  isLive: boolean;
}> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const authUser = sessionData?.session?.user || null;

      if (!authUser) {
        return { user: null, profile: null, isLive: true };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        return {
          user: authUser,
          profile: {
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            phone: profile.phone,
            totalPoints: profile.points_balance,
            lifetimeSteps: profile.total_steps,
            streakDays: profile.streak_days,
            role: profile.role
          },
          isLive: true
        };
      }

      return {
        user: authUser,
        profile: {
          id: authUser.id,
          name: authUser.user_metadata?.full_name || 'Walker',
          email: authUser.email || '',
          phone: authUser.user_metadata?.phone || '',
          totalPoints: 1000,
          lifetimeSteps: 0,
          streakDays: 1,
          role: 'user'
        },
        isLive: true
      };
    } catch {
      return { user: null, profile: null, isLive: true };
    }
  }

  // Check demo local session
  const stored = localStorage.getItem('walkx_demo_user');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        user: null,
        profile: {
          id: parsed.id,
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          totalPoints: parsed.pointsBalance ?? 12500,
          lifetimeSteps: parsed.totalSteps ?? 18450,
          streakDays: parsed.streakDays ?? 7,
          role: parsed.role ?? 'user'
        },
        isLive: false
      };
    } catch {
      // Fallback
    }
  }

  return { user: null, profile: null, isLive: false };
}

/**
 * Sign Out User
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
 * 2. User claims must be verified via `profiles.role IN ('admin', 'moderator')` signed by Supabase Auth JWT.
 * 3. Administrative tables must deny public access by default.
 */
export async function adminLogin(email: string, secretKey: string): Promise<AuthResponse> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Live Supabase Backend
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: secretKey
      });

      if (error) {
        return { success: false, error: error.message, isDemoSandbox: false };
      }

      if (!data.user) {
        return { success: false, error: 'Administrative account not found.', isDemoSandbox: false };
      }

      // Check verified database role in public.profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userRole = profile?.role || data.user.app_metadata?.role;

      if (userRole !== 'admin' && userRole !== 'moderator') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access Denied: Account lacks verified administrative clearance (Database RLS check failed).',
          isDemoSandbox: false
        };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: profile?.full_name || data.user.user_metadata?.full_name || 'Administrator',
          role: userRole
        },
        session: data.session,
        isDemoSandbox: false
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Supabase admin authentication failed.', isDemoSandbox: false };
    }
  }

  // 2. Demo Sandbox Fallback
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

  localStorage.setItem(
    'walkx_admin_session',
    JSON.stringify({
      authenticatedAt: Date.now(),
      role: 'admin',
      email: cleanEmail
    })
  );

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
