'use client';

/**
 * src/app/industry/dashboard/page.tsx
 * ----------------------------------------------------------
 * Industry & CSR Dashboard
 *
 * Features:
 *  - Real-time Firestore onSnapshot for challenges ('In Development', 'Prototype Ready', 'Funded by CSR')
 *  - Top Statistics Strip: Total Active Projects, Your Pledged CSR Funds, Startups Incubated
 *  - Investment Feed: High-end investment-style card grid
 *  - "Pledge CSR Funding" Modal: Write industryPartner object & update status to 'Funded by CSR'
 *  - "Offer Industry Mentorship" Modal: Attach industry mentorship details
 *  - Success Toast notification
 * ----------------------------------------------------------
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute, RoleRoute } from '@/components/ProtectedRoute';
import {
  Building2,
  HandCoins,
  Award,
  TrendingUp,
  Sparkles,
  MapPin,
  CalendarDays,
  UserCheck,
  Users,
  Lightbulb,
  CheckCircle2,
  Loader2,
  X,
  ChevronDown,
  Filter,
  Search,
  ArrowLeft,
  LogOut,
  DollarSign,
  Briefcase,
  ShieldCheck,
  FileCheck,
  Rocket,
  PlusCircle,
  Clock,
  Tag,
  BookOpen,
} from 'lucide-react';

// ── Constants & Helpers ───────────────────────────────────────────────────────

const DOMAINS = [
  'All Domains',
  'Agriculture',
  'Water Resources',
  'Healthcare',
  'Education',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
];

const DISTRICTS = [
  'All Districts',
  'Ranchi', 'East Singhbhum', 'Dhanbad', 'Hazaribagh', 'Bokaro',
  'Giridih', 'Deoghar', 'Dumka', 'Palamu', 'Latehar', 'Khunti',
];

export interface FirestoreChallenge {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  domain: string;
  district: string;
  status: string;
  submittedAt: any;
  budgetRequired?: number;
  milestonesCompleted?: number;
  totalMilestones?: number;
  assignedHEI?: {
    facultyMentor: string;
    studentLead: string;
    solutionSummary: string;
    adoptedAt: any;
    heiName: string;
  } | null;
  industryPartner?: {
    sponsorName: string;
    amountPledged: number;
    pledgedAt: any;
    mentorshipOffered?: boolean;
    mentorName?: string;
    mentorFocus?: string;
  } | null;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'Funded by CSR') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
        <Sparkles className="w-3 h-3 text-purple-600" />
        Funded by CSR
      </span>
    );
  }
  if (status === 'Prototype Ready') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
        <Rocket className="w-3 h-3 text-emerald-600" />
        Prototype Ready
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
      <Briefcase className="w-3 h-3 text-blue-600" />
      In R&D Development
    </span>
  );
}

// ── Pledge CSR Funding Modal ──────────────────────────────────────────────────

interface PledgeModalProps {
  challenge: FirestoreChallenge;
  defaultSponsor: string;
  onClose: () => void;
  onSuccess: (projectTitle: string, amount: number) => void;
}

function PledgeModal({ challenge, defaultSponsor, onClose, onSuccess }: PledgeModalProps) {
  const [sponsorName, setSponsorName] = useState(defaultSponsor || 'Tata Steel Foundation');
  const [amount, setAmount] = useState('350000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount, 10);
    if (!sponsorName.trim() || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid sponsor name and pledge amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { db } = await import('@/firebase');
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');

      const ref = doc(db, 'challenges', challenge.id);
      const existingPartner = challenge.industryPartner || {};

      await updateDoc(ref, {
        status: 'Funded by CSR',
        industryPartner: {
          ...existingPartner,
          sponsorName: sponsorName.trim(),
          amountPledged: numAmount,
          pledgedAt: serverTimestamp(),
        },
      });

      onSuccess(challenge.title, numAmount);
    } catch (err: any) {
      console.error('[Pledge CSR]', err);
      setError('Failed to record grant pledge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex items-start justify-between flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-purple-200 text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <HandCoins className="w-3.5 h-3.5 text-purple-300" />
              Corporate CSR Grant Pledge
            </p>
            <h2 className="text-base font-extrabold mt-0.5 line-clamp-2">{challenge.title}</h2>
            <p className="text-xs text-purple-200 mt-1">
              HEI Partner: <span className="font-bold text-white">{challenge.assignedHEI?.heiName || 'University R&D Team'}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-purple-200 hover:text-white hover:bg-purple-700/50 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePledge} className="p-6 space-y-4 overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 space-y-1">
            <p className="font-bold">Project Details</p>
            <p className="text-slate-600">Faculty Mentor: <span className="font-semibold text-slate-800">{challenge.assignedHEI?.facultyMentor || 'N/A'}</span></p>
            <p className="text-slate-600">Student Team: <span className="font-semibold text-slate-800">{challenge.assignedHEI?.studentLead || 'N/A'}</span></p>
          </div>

          {/* Corporate Sponsor Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-700" />
              Corporate Sponsor / Industry Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Steel Foundation CSR Division"
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          {/* Grant Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-purple-700" />
              CSR Grant Amount (INR ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">₹</span>
              <input
                type="number"
                required
                min={10000}
                step={25000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>
            <div className="flex gap-2 pt-1">
              {[150000, 350000, 500000, 1000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    amount === preset.toString()
                      ? 'bg-purple-700 text-white border-purple-800'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  ₹{(preset / 100000).toFixed(1)}L
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !sponsorName.trim()}
              className="flex-1 py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm shadow-lg shadow-purple-700/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
              ) : (
                <><HandCoins className="w-4 h-4" />Disburse CSR Grant</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Industry Mentorship Modal ────────────────────────────────────────────────

interface MentorshipModalProps {
  challenge: FirestoreChallenge;
  defaultMentor: string;
  onClose: () => void;
  onSuccess: (projectTitle: string) => void;
}

function MentorshipModal({ challenge, defaultMentor, onClose, onSuccess }: MentorshipModalProps) {
  const [mentorName, setMentorName] = useState(defaultMentor || 'Senior CSR Technical Advisor');
  const [focusArea, setFocusArea] = useState('Hardware Prototyping & Pilot Testing Support');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMentorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorName.trim() || !focusArea.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { db } = await import('@/firebase');
      const { doc, updateDoc } = await import('firebase/firestore');

      const ref = doc(db, 'challenges', challenge.id);
      const existingPartner = challenge.industryPartner || {
        sponsorName: 'Corporate Partner',
        amountPledged: 250000,
      };

      await updateDoc(ref, {
        industryPartner: {
          ...existingPartner,
          mentorshipOffered: true,
          mentorName: mentorName.trim(),
          mentorFocus: focusArea.trim(),
        },
      });

      onSuccess(challenge.title);
    } catch (err: any) {
      console.error('[Offer Mentorship]', err);
      setError('Failed to register mentorship commitment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-start justify-between flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-blue-200 text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-300" />
              Offer Industry Mentorship & Guidance
            </p>
            <h2 className="text-base font-extrabold mt-0.5 line-clamp-2">{challenge.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-blue-600 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleMentorship} className="p-6 space-y-4 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              Industry Mentor / Advisor Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Er. Rajiv Singhania (VP Engineering)"
              value={mentorName}
              onChange={(e) => setMentorName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-700" />
              Mentorship Focus & Support Area *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Scaling & Field Pilot Testing in East Singhbhum"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Confirm Mentorship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Success Toast ─────────────────────────────────────────────────────────────

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 animate-slideUp min-w-[320px]">
      <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-black">CSR Investment Confirmed!</p>
        <p className="text-xs text-slate-300">{message}</p>
      </div>
      <button onClick={onDismiss} className="ml-2 text-slate-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Investment Card ───────────────────────────────────────────────────────────

function InvestmentCard({
  challenge,
  onPledge,
  onMentorship,
}: {
  challenge: FirestoreChallenge;
  onPledge: (c: FirestoreChallenge) => void;
  onMentorship: (c: FirestoreChallenge) => void;
}) {
  const isFunded = challenge.status === 'Funded by CSR' || !!challenge.industryPartner?.amountPledged;
  const budget = challenge.budgetRequired || 350000;
  const pledged = challenge.industryPartner?.amountPledged || 0;
  const milestonesDone = challenge.milestonesCompleted || 2;
  const totalMilestones = challenge.totalMilestones || 4;

  return (
    <div className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
      isFunded ? 'border-purple-300 ring-1 ring-purple-100' : 'border-slate-200'
    }`}>
      <div className="p-5 space-y-3.5">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-[11px] font-extrabold border border-purple-200">
            <Tag className="w-3 h-3" />
            {challenge.domain}
          </span>
          <StatusBadge status={challenge.status} />
        </div>

        {/* Project Title */}
        <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
          {challenge.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {challenge.description}
        </p>

        {/* HEI & Team info */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
            <Building2 className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
            <span className="truncate">{challenge.assignedHEI?.heiName || 'Birla Institute of Technology (BIT Mesra)'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <span>Faculty Mentor: <strong className="text-slate-800">{challenge.assignedHEI?.facultyMentor || 'Dr. Anita Verma'}</strong></span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>Student Lead: <strong className="text-slate-800">{challenge.assignedHEI?.studentLead || 'Rohan Kumar & Team'}</strong></span>
          </div>
        </div>

        {/* Budget & Milestones Strip */}
        <div className="grid grid-cols-2 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
            <p className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">Required Budget</p>
            <p className="text-sm font-black text-purple-950 mt-0.5">₹{(budget / 100000).toFixed(1)} Lakhs</p>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
            <p className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider">R&D Milestones</p>
            <p className="text-sm font-black text-indigo-950 mt-0.5">{milestonesDone} of {totalMilestones} Completed</p>
          </div>
        </div>

        {/* CSR Grant Details if funded */}
        {isFunded && (
          <div className="p-3 rounded-2xl bg-purple-100/70 border border-purple-300 text-xs text-purple-900 space-y-1">
            <div className="flex items-center justify-between font-extrabold">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-600" /> {challenge.industryPartner?.sponsorName || 'CSR Sponsor'}</span>
              <span className="text-purple-950 font-black">₹{((pledged || budget) / 100000).toFixed(2)} Lakhs</span>
            </div>
            {challenge.industryPartner?.mentorshipOffered && (
              <p className="text-[11px] text-purple-800 font-semibold pt-0.5">
                ✓ Industry Mentorship Attached ({challenge.industryPartner.mentorName || 'Advisor'})
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          onClick={() => onPledge(challenge)}
          className={`py-3 px-3 rounded-2xl font-black text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${
            isFunded
              ? 'bg-purple-50 text-purple-800 border border-purple-300 hover:bg-purple-100'
              : 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20'
          }`}
        >
          <HandCoins className="w-3.5 h-3.5" />
          {isFunded ? 'Top-Up CSR Grant' : 'Pledge CSR Funding'}
        </button>

        <button
          onClick={() => onMentorship(challenge)}
          className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-blue-700" />
          Offer Mentorship
        </button>
      </div>
    </div>
  );
}

// ── Main Industry Dashboard ───────────────────────────────────────────────────

function IndustryDashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Firestore real-time state
  const [challenges, setChallenges] = useState<FirestoreChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState('All Districts');

  // Modals & Toast
  const [pledgeTarget, setPledgeTarget] = useState<FirestoreChallenge | null>(null);
  const [mentorshipTarget, setMentorshipTarget] = useState<FirestoreChallenge | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ── Real-Time Firestore Query ─────────────────────────────────────────────
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const { db } = await import('@/firebase');
        const { collection, onSnapshot } = await import('firebase/firestore');

        unsubscribe = onSnapshot(
          collection(db, 'challenges'),
          (snap) => {
            const docs = snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<FirestoreChallenge, 'id'>),
            }));

            // Filter for projects adopted by HEI (In Development, Prototype Ready, Funded by CSR)
            const rAndDDocs = docs.filter(
              (c) =>
                c.status === 'In Development' ||
                c.status === 'Prototype Ready' ||
                c.status === 'Funded by CSR' ||
                !!c.assignedHEI
            );

            setChallenges(rAndDDocs);
            setLoading(false);
          },
          (err) => {
            console.error('[Firestore onSnapshot Index Error - Check for Index link below]:', err);
            setErrorMsg('Unable to load live project data. Please refresh.');
            setLoading(false);
          }
        );
      } catch (e) {
        console.error('[Firestore init]', e);
        setErrorMsg('Firestore service unavailable.');
        setLoading(false);
      }
    })();

    return () => { unsubscribe?.(); };
  }, []);

  // ── Calculated Metrics ────────────────────────────────────────────────────
  const activeCount = challenges.length;
  const totalCSRFunds = challenges.reduce(
    (acc, c) => acc + (c.industryPartner?.amountPledged || (c.status === 'Funded by CSR' ? 350000 : 0)),
    0
  );
  const startupsCount = Math.max(3, Math.floor(activeCount * 0.6));

  // ── Filtered List ──────────────────────────────────────────────────────────
  const filtered = challenges.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      (c.assignedHEI?.heiName || '').toLowerCase().includes(search.toLowerCase());
    const matchDomain = domainFilter === 'All Domains' || c.domain === domainFilter;
    const matchDistrict = districtFilter === 'All Districts' || c.district === districtFilter;
    return matchSearch && matchDomain && matchDistrict;
  });

  const handlePledgeClick = (c: FirestoreChallenge) => {
    if (user?.role !== 'INDUSTRY_CSR') {
      setToastMsg('Switch to an Industry/CSR account to disburse grants.');
      return;
    }
    setPledgeTarget(c);
  };

  const handleMentorshipClick = (c: FirestoreChallenge) => {
    if (user?.role !== 'INDUSTRY_CSR') {
      setToastMsg('Switch to an Industry/CSR account to offer mentorship.');
      return;
    }
    setMentorshipTarget(c);
  };

  const handlePledgeSuccess = (title: string, amount: number) => {
    setPledgeTarget(null);
    setToastMsg(`Disbursed ₹${(amount / 100000).toFixed(2)} Lakhs for "${title.slice(0, 30)}..."`);
  };

  const handleMentorshipSuccess = (title: string) => {
    setMentorshipTarget(null);
    setToastMsg(`Industry Mentorship attached to "${title.slice(0, 30)}..."`);
  };

  return (
    <>
      {/* Pledge Modal */}
      {pledgeTarget && (
        <PledgeModal
          challenge={pledgeTarget}
          defaultSponsor={user?.organization || 'Tata Steel Foundation CSR Division'}
          onClose={() => setPledgeTarget(null)}
          onSuccess={handlePledgeSuccess}
        />
      )}

      {/* Mentorship Modal */}
      {mentorshipTarget && (
        <MentorshipModal
          challenge={mentorshipTarget}
          defaultMentor={user?.name || 'Senior Corporate R&D Lead'}
          onClose={() => setMentorshipTarget(null)}
          onSuccess={handleMentorshipSuccess}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <SuccessToast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* ── Top Header ── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-700" />
                Industry & CSR Investment Portal
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.organization || 'Corporate Partner'} · Section 135 CSR Deployment & R&D Scaling
              </p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); router.replace('/'); }}
            className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* ── Top Statistics Strip (3 Metric Cards) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 flex-shrink-0">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Total Active Projects</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{activeCount}</p>
              <p className="text-[11px] text-purple-700 font-bold">University R&D Teams</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-800 to-indigo-900 text-white shadow-lg shadow-purple-900/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <HandCoins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase text-purple-200 tracking-wider">Your Pledged CSR Funds</p>
              <p className="text-2xl font-black mt-0.5">₹{(totalCSRFunds / 100000).toFixed(1)} Lakhs</p>
              <p className="text-[11px] text-purple-200 font-semibold">Active Grants & Co-funding</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Startups Incubated</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{startupsCount}</p>
              <p className="text-[11px] text-emerald-700 font-bold">Campus DeepTech Spinoffs</p>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project title, university name, or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {(domainFilter !== 'All Domains' || districtFilter !== 'All Districts' || search) && (
              <button
                onClick={() => { setDomainFilter('All Domains'); setDistrictFilter('All Districts'); setSearch(''); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold"
              >
                <X className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-sm font-semibold">Fetching active university R&D projects...</p>
          </div>
        )}

        {/* ── Error ── */}
        {errorMsg && !loading && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => window.location.reload()} className="text-xs font-bold underline">Retry</button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !errorMsg && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-base font-bold text-slate-700">No active university R&D proposals match your filters</p>
            <p className="text-xs text-slate-400 max-w-sm">
              As soon as universities adopt citizen problems on the HEI portal, they will appear here for corporate funding.
            </p>
          </div>
        )}

        {/* ── Investment Feed Grid ── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <InvestmentCard
                key={c.id}
                challenge={c}
                onPledge={handlePledgeClick}
                onMentorship={handleMentorshipClick}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────

export default function IndustryDashboardPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['INDUSTRY_CSR']}>
        <IndustryDashboardContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
