'use client';

/**
 * src/context/AuthContext.tsx
 * ----------------------------------------------------------
 * Global Auth context for JanSamadhan.
 *
 * Dual auth strategy:
 *   CITIZEN              → Firebase Phone Number OTP
 *   UNIVERSITY / INDUSTRY / GOVT → Firebase Google OAuth
 *
 * Falls back to demo localStorage accounts in dev/offline mode.
 * ----------------------------------------------------------
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { UserRole } from '@/types';

// ── Global window extension for reCAPTCHA singleton ──────────────────────────
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthMethod = 'PHONE' | 'GOOGLE' | 'DEMO';

export interface AuthUser {
  id: string;            // Firebase UID or demo id
  name: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  role: UserRole;
  organization?: string;
  district?: string;
  authMethod: AuthMethod;
}

interface ConfirmationResult {
  confirm: (otp: string) => Promise<any>;
}

interface AuthContextType {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalRole: UserRole;
  authModalMode: 'login' | 'register';

  // Modal controls
  openAuthModal: (role?: UserRole, mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  // Phone OTP flow (Citizen)
  sendOtp: (phone: string, recaptchaContainerId: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  otpSent: boolean;
  otpLoading: boolean;
  phoneError: string;

  // Google OAuth flow (HEI / Industry / Govt)
  loginWithGoogle: (role?: UserRole) => Promise<boolean>;
  googleLoading: boolean;
  googleError: string;

  // Demo login (dev/offline)
  loginAsDemo: (role: UserRole) => void;

  // Session
  logout: () => Promise<void>;
}

// ── Demo accounts ─────────────────────────────────────────────────────────────

export const DEMO_ACCOUNTS: Record<UserRole, AuthUser> = {
  CITIZEN: {
    id: 'demo-cit-101',
    name: 'Sunil Munda',
    email: 'sunil.munda@jansamadhan.gov.in',
    phoneNumber: '+919999999999',
    role: 'CITIZEN',
    district: 'Ranchi',
    organization: 'Namkum Gram Panchayat',
    authMethod: 'DEMO',
  },
  UNIVERSITY_FACULTY: {
    id: 'demo-uni-201',
    name: 'Dr. Anita Verma',
    email: 'dr.anita@bitmesra.ac.in',
    role: 'UNIVERSITY_FACULTY',
    district: 'Ranchi',
    organization: 'Birla Institute of Technology (BIT Mesra)',
    authMethod: 'DEMO',
  },
  UNIVERSITY_STUDENT: {
    id: 'demo-stu-202',
    name: 'Rohan Kumar',
    email: 'rohan.student@bitmesra.ac.in',
    role: 'UNIVERSITY_STUDENT',
    district: 'Ranchi',
    organization: 'BIT Mesra Innovation Team',
    authMethod: 'DEMO',
  },
  INDUSTRY_CSR: {
    id: 'demo-ind-301',
    name: 'Rajesh Sharma',
    email: 'csr.head@tatasteel.com',
    role: 'INDUSTRY_CSR',
    district: 'East Singhbhum',
    organization: 'Tata Steel Foundation CSR Division',
    authMethod: 'DEMO',
  },
  GOVT_ADMIN: {
    id: 'demo-adm-401',
    name: 'Amitabh Sen, IAS',
    email: 'dc.ranchi@jharkhand.gov.in',
    role: 'GOVT_ADMIN',
    district: 'Ranchi',
    organization: 'District Magistrate & DC Ranchi',
    authMethod: 'DEMO',
  },
};

// ── Role inference from Google account email domain ───────────────────────────

function inferRoleFromEmail(email: string): UserRole {
  if (email.endsWith('.ac.in') || email.endsWith('.edu.in')) return 'UNIVERSITY_FACULTY';
  if (email.includes('.gov.in') || email.includes('ias@')) return 'GOVT_ADMIN';
  return 'INDUSTRY_CSR'; // default for corporate Google accounts
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('CITIZEN');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Phone OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  // Google OAuth state
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  // ── Restore session from localStorage on mount ──────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jansamadhan_auth_user_v2');
      if (saved) {
        setUser(JSON.parse(saved));
        return;
      }
    } catch {}

    // ── Listen to Firebase auth state (lazy import to avoid SSR issues) ────────
    let unsubscribe: (() => void) | null = null;

    import('@/firebase').then(({ auth }) => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            // If we have a Firebase user but no local session, restore from Firebase
            const savedRaw = localStorage.getItem('jansamadhan_auth_user_v2');
            if (!savedRaw) {
              const isPhone = !!firebaseUser.phoneNumber;
              const email = firebaseUser.email || '';
              const role: UserRole = isPhone ? 'CITIZEN' : inferRoleFromEmail(email);
              const restoredUser: AuthUser = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || (isPhone ? 'Citizen User' : email.split('@')[0]),
                email,
                phoneNumber: firebaseUser.phoneNumber || undefined,
                photoURL: firebaseUser.photoURL || undefined,
                role,
                authMethod: isPhone ? 'PHONE' : 'GOOGLE',
              };
              persistUser(restoredUser);
            }
          }
        });
      });
    }).catch(() => {
      // Firebase not yet initialized (SSR / missing config) — use demo mode
      setUser(DEMO_ACCOUNTS.CITIZEN);
    });

    return () => { unsubscribe?.(); };
  }, []);

  // ── Persist helpers ────────────────────────────────────────────────────────
  const persistUser = (u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('jansamadhan_auth_user_v2', JSON.stringify(u));
    } else {
      localStorage.removeItem('jansamadhan_auth_user_v2');
    }
  };

  // ── Firestore: upsert user doc on first login ────────────────────────────────
  const upsertUserDoc = async (u: AuthUser): Promise<AuthUser> => {
    try {
      const { db } = await import('@/firebase');
      const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');

      const ref = doc(db, 'users', u.id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // New user — write full profile
        await setDoc(ref, {
          uid: u.id,
          name: u.name,
          email: u.email || null,
          phoneNumber: u.phoneNumber || null,
          photoURL: u.photoURL || null,
          role: u.role,
          district: u.district || null,
          organization: u.organization || null,
          authMethod: u.authMethod,
          createdAt: serverTimestamp(),
        });
        return u; // use role passed in
      } else {
        // Existing user — restore their saved role from Firestore
        const data = snap.data();
        return { ...u, role: (data.role as AuthUser['role']) || u.role };
      }
    } catch (err) {
      console.error('[Firestore upsert]', err);
      return u; // fail-open
    }
  };

  // ── Modal controls ─────────────────────────────────────────────────────────
  const openAuthModal = (role: UserRole = 'CITIZEN', mode: 'login' | 'register' = 'login') => {
    setAuthModalRole(role);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setOtpSent(false);
    setPhoneError('');
    setGoogleError('');
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setOtpSent(false);
    setPhoneError('');
    setGoogleError('');
    confirmationRef.current = null;
  };

  // ── Phone OTP: Send ────────────────────────────────────────────────────────
  const sendOtp = async (phone: string, recaptchaContainerId: string): Promise<void> => {
    setOtpLoading(true);
    setPhoneError('');

    try {
      const { auth } = await import('@/firebase');
      const { signInWithPhoneNumber, RecaptchaVerifier } = await import('firebase/auth');

      // Guard: only create once — prevents 'reCAPTCHA already rendered' error
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: 'invisible',
        });
      }

      const appVerifier = window.recaptchaVerifier;
      const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      confirmationRef.current = confirmationResult;
      setOtpSent(true);
    } catch (err: any) {
      console.error('[Firebase Phone OTP]', err);
      setPhoneError(
        err.code === 'auth/invalid-phone-number'
          ? 'Invalid phone number. Please enter a valid 10-digit number.'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : `Failed to send OTP: ${err.message}`
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Phone OTP: Verify ──────────────────────────────────────────────────────
  const verifyOtp = async (otp: string): Promise<boolean> => {
    if (!confirmationRef.current) {
      setPhoneError('Session expired. Please resend OTP.');
      return false;
    }

    setOtpLoading(true);
    setPhoneError('');

    try {
      const result = await confirmationRef.current.confirm(otp);
      const firebaseUser = result.user;

      const newUser: AuthUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Citizen User',
        email: firebaseUser.email || '',
        phoneNumber: firebaseUser.phoneNumber || undefined,
        role: 'CITIZEN',
        district: 'Ranchi',
        authMethod: 'PHONE',
      };

      const finalUser = await upsertUserDoc(newUser);
      persistUser(finalUser);
      closeAuthModal();
      return true;
    } catch (err: any) {
      console.error('[Firebase OTP Verify]', err);
      setPhoneError(
        err.code === 'auth/invalid-verification-code'
          ? 'Incorrect OTP. Please check and try again.'
          : err.code === 'auth/code-expired'
          ? 'OTP has expired. Please resend.'
          : `Verification failed: ${err.message}`
      );
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Google OAuth ───────────────────────────────────────────────────────────
  const loginWithGoogle = async (roleHint?: UserRole): Promise<boolean> => {
    setGoogleLoading(true);
    setGoogleError('');

    try {
      const { auth, googleProvider } = await import('@/firebase');
      const { signInWithPopup } = await import('firebase/auth');

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const email = firebaseUser.email || '';
      const role = roleHint || inferRoleFromEmail(email);

      const newUser: AuthUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0],
        email,
        photoURL: firebaseUser.photoURL || undefined,
        role,
        authMethod: 'GOOGLE',
      };

      const finalUser = await upsertUserDoc(newUser);
      persistUser(finalUser);
      closeAuthModal();
      return true;
    } catch (err: any) {
      console.error('[Firebase Google OAuth]', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setGoogleError(
          err.code === 'auth/popup-blocked'
            ? 'Popup was blocked. Please allow popups for this site.'
            : `Google Sign-In failed: ${err.message}`
        );
      }
      return false;
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Demo login (dev / offline) ─────────────────────────────────────────────
  const loginAsDemo = (role: UserRole) => {
    persistUser(DEMO_ACCOUNTS[role]);
    closeAuthModal();
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      const { auth } = await import('@/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch {}
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalRole,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        otpSent,
        otpLoading,
        phoneError,
        loginWithGoogle,
        googleLoading,
        googleError,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
