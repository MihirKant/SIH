'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ScanEye,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Camera,
  Loader2,
  ChevronRight,
  Fingerprint,
  Eye,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type VerificationStep = {
  id: number;
  label: string;
  detail: string;
  state: 'passed' | 'pending' | 'locked';
  value?: string;
};

interface ZeroTrustVerificationProps {
  /** Current challenge status from Firestore */
  status: string;
  /** Compact mode for embedding inside cards */
  compact?: boolean;
  /** Called when the user "uploads proof" — can be used to trigger parent state */
  onProofUploaded?: () => void;
}

// ── Simulated Verification Data ───────────────────────────────────────────────

function getVerificationSteps(proofUploaded: boolean): VerificationStep[] {
  return [
    {
      id: 1,
      label: 'AI Proof-of-Work Analysis',
      detail: 'Comparing structural similarity of Pre- and Post-repair images.',
      state: proofUploaded ? 'passed' : 'pending',
      value: proofUploaded ? 'Passed: 89% Match' : 'Awaiting upload…',
    },
    {
      id: 2,
      label: 'Decentralized Citizen Consensus',
      detail: 'Anonymous verification by citizens within 50m geofence.',
      state: proofUploaded ? 'pending' : 'locked',
      value: proofUploaded ? '2 / 3 Witnesses Confirmed' : 'Locked',
    },
    {
      id: 3,
      label: 'CSR Fund Escrow Status',
      detail: 'Funds locked. Awaiting trilateral consensus.',
      state: proofUploaded ? 'pending' : 'locked',
      value: proofUploaded ? 'Consensus Pending' : 'Locked',
    },
  ];
}

// ── Step Indicator Icon ───────────────────────────────────────────────────────

function StepIcon({ step, compact }: { step: VerificationStep; compact?: boolean }) {
  const size = compact ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';

  if (step.state === 'passed') {
    return (
      <div className={`${size} rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-200`}>
        <CheckCircle2 className={iconSize} />
      </div>
    );
  }
  if (step.state === 'pending') {
    return (
      <div className={`${size} rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 ring-2 ring-amber-200 animate-pulse`}>
        {step.id === 2 ? <Users className={iconSize} /> : step.id === 3 ? <Lock className={iconSize} /> : <ScanEye className={iconSize} />}
      </div>
    );
  }
  // locked
  return (
    <div className={`${size} rounded-xl bg-slate-200 text-slate-400 flex items-center justify-center border border-slate-300`}>
      <Lock className={iconSize} />
    </div>
  );
}

// ── Step Row Component ────────────────────────────────────────────────────────

function StepRow({ step, isLast, compact }: { step: VerificationStep; isLast: boolean; compact?: boolean }) {
  return (
    <div className="flex items-start gap-3 relative">
      {/* Vertical connector */}
      {!isLast && (
        <div className="absolute left-4 md:left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-transparent" style={{ height: compact ? '28px' : '36px' }} />
      )}

      <StepIcon step={step} compact={compact} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4 className={`font-extrabold ${compact ? 'text-xs' : 'text-sm'} ${
            step.state === 'passed' ? 'text-emerald-800' :
            step.state === 'pending' ? 'text-amber-800' :
            'text-slate-400'
          }`}>
            Step {step.id}: {step.label}
          </h4>

          {/* Value badge */}
          {step.value && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
              step.state === 'passed'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : step.state === 'pending'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              {step.state === 'passed' && <CheckCircle2 className="w-3 h-3" />}
              {step.state === 'pending' && step.id === 3 && <Lock className="w-3 h-3" />}
              {step.state === 'pending' && step.id === 2 && <Eye className="w-3 h-3" />}
              {step.state === 'locked' && <Lock className="w-3 h-3" />}
              {step.value}
            </span>
          )}
        </div>

        <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-slate-500 mt-0.5 leading-relaxed`}>
          {step.detail}
        </p>
      </div>
    </div>
  );
}

// ── Upload Proof-of-Work Button (Demo) ────────────────────────────────────────

function UploadProofButton({ onUpload }: { onUpload: () => void }) {
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    setUploading(true);
    // Simulate upload delay for demo
    setTimeout(() => {
      setUploading(false);
      onUpload();
    }, 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={uploading}
      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-800 hover:to-indigo-800 text-white font-black text-sm shadow-lg shadow-violet-700/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 group"
    >
      {uploading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading Proof of Work…
        </>
      ) : (
        <>
          <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Upload Proof of Work
          <ChevronRight className="w-4 h-4 opacity-50" />
        </>
      )}
    </button>
  );
}

// ── Main Exported Component ───────────────────────────────────────────────────

export default function ZeroTrustVerification({ status, compact = false, onProofUploaded }: ZeroTrustVerificationProps) {
  const [proofUploaded, setProofUploaded] = useState(false);

  // Determine which statuses should show the verification pipeline
  const isResolved = status === 'Resolved';
  const isPendingVerification = status === 'Pending Verification';
  const isAdoptedByHEI = status === 'In Development' || status === 'Adopted by HEI';
  const isFunded = status === 'Funded by CSR' || status === 'Prototype Ready';
  const shouldShowVerification = isResolved || isPendingVerification || proofUploaded;
  const shouldShowUploadButton = (isAdoptedByHEI || isFunded) && !proofUploaded;

  // If not relevant status, render nothing
  if (!shouldShowVerification && !shouldShowUploadButton) return null;

  const handleProofUpload = () => {
    setProofUploaded(true);
    onProofUploaded?.();
  };

  const steps = getVerificationSteps(proofUploaded || isResolved || isPendingVerification);

  // For resolved challenges, override step states
  const resolvedSteps: VerificationStep[] = isResolved
    ? steps.map((s) => ({
        ...s,
        state: 'passed' as const,
        value: s.id === 1 ? 'Passed: 89% Match' : s.id === 2 ? '3 / 3 Witnesses Confirmed' : 'Funds Released ✓',
      }))
    : steps;

  return (
    <div className={`rounded-2xl border overflow-hidden ${compact ? '' : 'shadow-sm'} ${
      shouldShowVerification
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 text-white'
        : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      {shouldShowVerification && (
        <div className={`${compact ? 'px-3 py-2.5' : 'px-5 py-4'} border-b border-slate-700/50 flex items-center gap-2.5`}>
          <div className={`${compact ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30`}>
            <Fingerprint className={compact ? 'w-3.5 h-3.5 text-white' : 'w-5 h-5 text-white'} />
          </div>
          <div className="min-w-0">
            <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-black tracking-wide`}>
              Zero-Trust Trilateral Verification
            </h3>
            <p className={`${compact ? 'text-[9px]' : 'text-[11px]'} text-slate-400 font-semibold`}>
              Anti-Fraud Resolution Engine · Game Theory Consensus
            </p>
          </div>
          {isResolved && (
            <span className="ml-auto px-2 py-0.5 rounded-lg bg-emerald-600/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
              <Unlock className="w-3 h-3" /> VERIFIED
            </span>
          )}
          {!isResolved && (
            <span className="ml-auto px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> IN PROGRESS
            </span>
          )}
        </div>
      )}

      {/* Verification Steps */}
      {shouldShowVerification && (
        <div className={`${compact ? 'p-3 space-y-3' : 'p-5 space-y-5'}`}>
          {resolvedSteps.map((step, idx) => (
            <StepRow
              key={step.id}
              step={step}
              isLast={idx === resolvedSteps.length - 1}
              compact={compact}
            />
          ))}
        </div>
      )}

      {/* Upload Proof-of-Work CTA (only for adopted/funded but not yet verified) */}
      {shouldShowUploadButton && (
        <div className={compact ? 'p-3' : 'p-5'}>
          <div className={`${compact ? 'p-3' : 'p-4'} rounded-2xl bg-violet-50 border border-violet-200 space-y-2.5`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-violet-700`} />
              <span className={`${compact ? 'text-xs' : 'text-sm'} font-extrabold text-violet-900`}>
                Verification Required
              </span>
            </div>
            <p className="text-[11px] text-violet-700 leading-relaxed">
              Upload proof-of-work (before/after photos) to trigger the Zero-Trust Trilateral Resolution Engine. AI, citizens, and escrow will independently verify resolution integrity.
            </p>
            <UploadProofButton onUpload={handleProofUpload} />
          </div>
        </div>
      )}

      {/* Trust Explainer Footer */}
      {shouldShowVerification && (
        <div className={`${compact ? 'px-3 pb-3' : 'px-5 pb-5'}`}>
          <div className={`${compact ? 'p-2' : 'p-3'} rounded-xl bg-slate-800/60 border border-slate-700/50`}>
            <p className={`${compact ? 'text-[9px]' : 'text-[10px]'} text-slate-400 leading-relaxed`}>
              <span className="font-bold text-slate-300">How it works:</span> Three independent verification layers must reach consensus before CSR escrow funds are released — preventing vendor fraud, money laundering, and false resolution claims.
              {!compact && ' AI compares structural imagery, randomized geo-fenced citizens provide anonymous witness confirmation, and smart-contract escrow locks funds until trilateral consensus is achieved.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
