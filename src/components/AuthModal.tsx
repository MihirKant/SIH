'use client';

/**
 * src/components/AuthModal.tsx
 * ----------------------------------------------------------
 * Dual-path authentication modal for JanSamadhan.
 *
 * Path A — Citizen (Phone OTP):
 *   +91 phone input → invisible reCAPTCHA → 6-digit OTP grid
 *
 * Path B — HEI / Industry / Govt (Google OAuth):
 *   "Continue with Google" popup → role confirmation
 * ----------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_ACCOUNTS } from '@/context/AuthContext';
import { ROLE_DASHBOARD } from '@/components/ProtectedRoute';
import { UserRole } from '@/types';
import {
  X,
  Users,
  GraduationCap,
  Building2,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  Phone,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Loader2,
  AlertCircle,
  LogOut,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

const PHONE_OTP_ROLES: UserRole[] = ['CITIZEN'];

const ROLES_INFO = [
  {
    role: 'CITIZEN' as UserRole,
    label: 'Citizen / नागरिक',
    sub: 'Report local problems via phone OTP',
    icon: Users,
    route: '/citizen/dashboard',
    color: 'bg-green-700 text-white',
    border: 'border-green-600 ring-2 ring-green-400/30',
    tag: 'SMS OTP',
    tagColor: 'bg-green-100 text-green-800',
  },
  {
    role: 'UNIVERSITY_FACULTY' as UserRole,
    label: 'HEI / University',
    sub: 'Faculty & student researchers',
    icon: GraduationCap,
    route: '/hei/dashboard',
    color: 'bg-blue-700 text-white',
    border: 'border-blue-600 ring-2 ring-blue-400/30',
    tag: 'Google Sign-In',
    tagColor: 'bg-blue-100 text-blue-800',
  },
  {
    role: 'INDUSTRY_CSR' as UserRole,
    label: 'Industry / CSR',
    sub: 'CSR sponsors & corporate investors',
    icon: Building2,
    route: '/industry/dashboard',
    color: 'bg-purple-700 text-white',
    border: 'border-purple-600 ring-2 ring-purple-400/30',
    tag: 'Google Sign-In',
    tagColor: 'bg-purple-100 text-purple-800',
  },
  {
    role: 'GOVT_ADMIN' as UserRole,
    label: 'Government Admin',
    sub: 'District officers & policy makers',
    icon: LayoutDashboard,
    route: '/govt/dashboard',
    color: 'bg-amber-700 text-white',
    border: 'border-amber-600 ring-2 ring-amber-400/30',
    tag: 'Google Sign-In',
    tagColor: 'bg-amber-100 text-amber-800',
  },
];

// ── Google Logo SVG ───────────────────────────────────────────────────────────

const GoogleLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// ── OTP Input Grid ────────────────────────────────────────────────────────────

function OtpInputGrid({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d*$/.test(char)) return;
    const digits = value.split('');
    digits[idx] = char.slice(-1);
    const next = digits.join('');
    onChange(next);
    if (char && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className="w-11 h-14 text-center text-xl font-black rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-green-600 focus:outline-none focus:bg-white transition-all disabled:opacity-40"
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ── Main Modal Component ──────────────────────────────────────────────────────

export default function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    authModalRole,
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
  } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('CITIZEN');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPhoneRole = PHONE_OTP_ROLES.includes(selectedRole);
  const roleInfo = ROLES_INFO.find((r) => r.role === selectedRole)!;

  // Sync role when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setSelectedRole(authModalRole);
      setPhone('');
      setOtp('');
      setResendTimer(0);
    }
  }, [isAuthModalOpen, authModalRole]);

  // Resend countdown
  const startResendTimer = useCallback(() => {
    setResendTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setPhone('');
    setOtp('');
  };

  // ── Handler: Send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (phone.replace(/\D/g, '').length < 10) return;
    await sendOtp(phone, 'recaptcha-container');
    if (!phoneError) startResendTimer();
  };

  // ── Handler: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    const ok = await verifyOtp(otp);
    if (ok) router.push(ROLE_DASHBOARD['CITIZEN']);
  };

  // ── Handler: Google Sign-In ────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    const ok = await loginWithGoogle(selectedRole);
    if (ok) router.push(ROLE_DASHBOARD[selectedRole]);
  };

  // ── Handler: Demo Login ────────────────────────────────────────────────────
  const handleDemoLogin = (role: UserRole) => {
    loginAsDemo(role);
    router.push(ROLE_DASHBOARD[role]);
  };

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}
    >
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" />

      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* ── Header ── */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-600 font-black text-lg flex items-center justify-center">JS</div>
            <div>
              <h2 className="text-sm font-extrabold">JanSamadhan — Secure Login</h2>
              <p className="text-[11px] text-slate-400">जन समाधान | Firebase Authentication</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* ── 1. Role Selector ── */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES_INFO.map((r) => {
                const Icon = r.icon;
                const active = selectedRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-2.5 ${
                      active ? `${r.border} bg-slate-50` : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${r.color} flex-shrink-0 shadow`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[11px] font-extrabold text-slate-900 leading-tight">{r.label}</span>
                        {active && <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />}
                      </div>
                      <span className={`mt-0.5 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md ${r.tagColor}`}>
                        {r.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 2A. Citizen — Phone OTP Flow ── */}
          {isPhoneRole && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-green-50 border border-green-200 space-y-3">
                <div className="flex items-center gap-2 text-green-800">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-bold">Phone Number Authentication (OTP)</span>
                </div>

                {!otpSent ? (
                  /* Phone input */
                  <div className="space-y-3">
                    <div className="flex items-stretch rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                      <div className="px-3 py-3 bg-slate-100 border-r border-slate-200 text-sm font-extrabold text-slate-600 flex items-center">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none"
                        maxLength={10}
                        disabled={otpLoading}
                      />
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={otpLoading || phone.replace(/\D/g, '').length < 10}
                      className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {otpLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending OTP...</span></>
                      ) : (
                        <><Phone className="w-4 h-4" /><span>Send OTP via SMS →</span></>
                      )}
                    </button>
                  </div>
                ) : (
                  /* OTP verify */
                  <div className="space-y-4">
                    <p className="text-xs text-green-700 font-semibold text-center">
                      OTP sent to <span className="font-black">+91 {phone}</span>. Enter it below:
                    </p>
                    <OtpInputGrid value={otp} onChange={setOtp} disabled={otpLoading} />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otp.length < 6}
                      className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {otpLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying...</span></>
                      ) : (
                        <><ShieldCheck className="w-4 h-4" /><span>Verify OTP & Sign In</span></>
                      )}
                    </button>
                    {/* Resend */}
                    <div className="text-center">
                      {resendTimer > 0 ? (
                        <span className="text-xs text-slate-500">Resend OTP in <span className="font-bold text-slate-700">{resendTimer}s</span></span>
                      ) : (
                        <button
                          onClick={handleSendOtp}
                          disabled={otpLoading}
                          className="text-xs text-green-700 font-bold hover:underline flex items-center gap-1 mx-auto"
                        >
                          <RefreshCw className="w-3 h-3" /> Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {phoneError && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{phoneError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 2B. HEI / Industry / Govt — Google OAuth Flow ── */}
          {!isPhoneRole && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <p className="text-xs text-blue-800 font-semibold">
                  Sign in with your institutional or organizational Google account. Your role will be auto-detected from your email domain.
                </p>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {googleLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin text-blue-600" /><span>Opening Google Sign-In...</span></>
                  ) : (
                    <><GoogleLogo /><span>Continue with Google</span><ArrowRight className="w-4 h-4 text-slate-400 ml-auto" /></>
                  )}
                </button>

                <div className="text-[10px] text-blue-700/70 font-medium text-center">
                  Role detected from email: <span className="font-bold">.ac.in → University · .gov.in → Govt · other → Industry</span>
                </div>

                {googleError && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{googleError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── 3. Quick Demo Login (Dev) ── */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Demo Login (No Firebase required)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ROLES_INFO.map((r) => (
                <button
                  key={r.role}
                  onClick={() => handleDemoLogin(r.role)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white border border-amber-200 text-slate-700 hover:bg-amber-100 transition-colors"
                >
                  {r.label.split('/')[0].trim()} Demo →
                </button>
              ))}
            </div>
          </div>

          {/* ── 4. Legal note ── */}
          <p className="text-[10px] text-slate-400 text-center leading-relaxed px-2">
            By signing in, you agree to JanSamadhan's Terms of Use. Your data is processed under the IT Act 2000 and Jharkhand e-Governance Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
