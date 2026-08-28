'use client';

/**
 * src/components/ProtectedRoute.tsx
 * -------------------------------------------------
 * <ProtectedRoute>  — blocks unauthenticated users, redirects to '/'
 * <RoleRoute>       — wraps ProtectedRoute + checks allowed roles,
 *                     redirects to the user's own dashboard on mismatch
 * -------------------------------------------------
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Loader2, ShieldX } from 'lucide-react';

// Role → dashboard route map (single source of truth)
export const ROLE_DASHBOARD: Record<UserRole, string> = {
  CITIZEN:            '/citizen/dashboard',
  UNIVERSITY_FACULTY: '/hei/dashboard',
  UNIVERSITY_STUDENT: '/hei/dashboard',
  INDUSTRY_CSR:       '/industry/dashboard',
  GOVT_ADMIN:         '/govt/dashboard',
};

// ── Loading Spinner ───────────────────────────────────────────────────────────

function AuthLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      <p className="text-sm font-semibold">Verifying your session…</p>
    </div>
  );
}

// ── Access Denied ─────────────────────────────────────────────────────────────

function AccessDenied({ requiredRoles }: { requiredRoles: UserRole[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const dest = user ? ROLE_DASHBOARD[user.role] : '/';

  useEffect(() => {
    const t = setTimeout(() => router.replace(dest), 2500);
    return () => clearTimeout(t);
  }, [dest, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <ShieldX className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-extrabold text-slate-900">Access Restricted</h2>
      <p className="text-sm text-slate-500 max-w-xs">
        This page is only for{' '}
        <span className="font-bold text-slate-700">
          {requiredRoles.join(' / ')}
        </span>{' '}
        accounts. Redirecting you to your dashboard…
      </p>
    </div>
  );
}

// ── ProtectedRoute ─────────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Always call hooks unconditionally before any early returns
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  // Still hydrating — show spinner
  if (!isAuthenticated) return <AuthLoading />;

  return <>{children}</>;
}

// ── RoleRoute ──────────────────────────────────────────────────────────────────

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Not authenticated — defer to ProtectedRoute wrapper
  if (!isAuthenticated || !user) return <AuthLoading />;

  // Role mismatch — show deny + auto-redirect to own dashboard
  if (!allowedRoles.includes(user.role)) {
    return <AccessDenied requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
}
