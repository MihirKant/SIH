'use client';

/**
 * src/app/citizen/dashboard/page.tsx
 * ----------------------------------------------------------
 * Citizen Dashboard with Real-Time Problem Tracking Module
 *
 * Features:
 *  - Firebase onSnapshot query filtering by `submittedBy == user.id`
 *  - "Track by ID" Search bar (matches tracking ID like JS-9Z5A9P or keywords)
 *  - "My Reports" List/Grid
 *  - Visual 4-Step Progress Timeline Tracker (Submitted -> Adopted R&D -> Funded & Scaling -> Deployed)
 *  - Route Protection: ProtectedRoute + RoleRoute(['CITIZEN'])
 *
 * NOTE ON FIRESTORE COMPOSITE INDEX:
 * ----------------------------------------------------------
 * Filtering by 'submittedBy' and ordering by 'submittedAt' in Firestore requires a composite index.
 * If your browser console displays a FirebaseError regarding a missing index, click the link
 * provided directly in the console error to build the index automatically in Firebase Console.
 * ----------------------------------------------------------
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute, RoleRoute } from '@/components/ProtectedRoute';
import {
  ClipboardList,
  MapPin,
  PlusCircle,
  Clock,
  CheckCircle2,
  Search,
  X,
  Loader2,
  ChevronRight,
  Tag,
  GraduationCap,
  Building2,
  Copy,
  Sparkles,
  Rocket,
  ArrowLeft,
  LogOut,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FirestoreChallenge {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  domain: string;
  district: string;
  status: string;
  submittedAt: any;
  submittedBy?: string;
  location?: { lat: number; lng: number } | null;
  assignedHEI?: {
    facultyMentor: string;
    studentLead: string;
    solutionSummary: string;
    heiName: string;
  } | null;
  industryPartner?: {
    sponsorName: string;
    amountPledged: number;
    mentorshipOffered?: boolean;
  } | null;
}

// ── Visual Status Timeline Step Calculator ───────────────────────────────────

function getTimelineStage(status: string, hasHEI: boolean, hasCSR: boolean): number {
  if (status === 'Resolved') return 4;
  if (status === 'Funded by CSR' || hasCSR) return 3;
  if (status === 'In Development' || status === 'Prototype Ready' || hasHEI) return 2;
  return 1;
}

// ── Step Timeline Component ───────────────────────────────────────────────────

function StatusTimeline({ challenge }: { challenge: FirestoreChallenge }) {
  const currentStage = getTimelineStage(
    challenge.status,
    !!challenge.assignedHEI,
    !!challenge.industryPartner?.amountPledged
  );

  const steps = [
    {
      stage: 1,
      title: 'Submitted & AI Categorized',
      subtitle: 'Received & routed to department',
      icon: Clock,
    },
    {
      stage: 2,
      title: 'Adopted for R&D',
      subtitle: challenge.assignedHEI?.heiName
        ? `Adopted by ${challenge.assignedHEI.heiName}`
        : 'Awaiting HEI Team adoption',
      icon: GraduationCap,
    },
    {
      stage: 3,
      title: 'Funded & Scaling',
      subtitle: challenge.industryPartner?.sponsorName
        ? `Funded by ${challenge.industryPartner.sponsorName}`
        : 'Awaiting Corporate CSR Grant',
      icon: Building2,
    },
    {
      stage: 4,
      title: 'Solution Deployed',
      subtitle: challenge.status === 'Resolved' ? 'Field deployment verified' : 'Final field pilot testing',
      icon: Rocket,
    },
  ];

  return (
    <div className="py-2">
      {/* Desktop & Mobile Responsive Stepper */}
      <div className="relative flex flex-col md:flex-row justify-between gap-4 md:gap-2">
        {/* Horizontal Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-500"
            style={{ width: `${((Math.max(1, currentStage) - 1) / 3) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isCompleted = currentStage > step.stage;
          const isCurrent = currentStage === step.stage;
          const isPending = currentStage < step.stage;
          const Icon = step.icon;

          return (
            <div key={step.stage} className="relative z-10 flex md:flex-col items-center md:text-center flex-1 gap-3 md:gap-2">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all flex-shrink-0 shadow-sm ${
                  isCompleted
                    ? 'bg-green-600 text-white ring-4 ring-green-100'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>

              {/* Step Text */}
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-black leading-tight ${isCurrent ? 'text-blue-900' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </p>
                <p className={`text-[11px] leading-tight mt-0.5 ${isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Citizen Dashboard Component ───────────────────────────────────────────────

function CitizenDashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Firestore real-time state
  const [userChallenges, setUserChallenges] = useState<FirestoreChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexNoteVisible, setIndexNoteVisible] = useState(false);

  // Search & Copy state
  const [searchId, setSearchId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [globalChallenge, setGlobalChallenge] = useState<FirestoreChallenge | null>(null);

  // ── Global Tracking ID Bypass Search ──
  useEffect(() => {
    if (!searchId.trim()) {
      setGlobalChallenge(null);
      return;
    }

    const term = searchId.trim().toUpperCase();
    if (!term.startsWith('JS-')) {
      setGlobalChallenge(null);
      return;
    }

    let isSubscribed = true;

    (async () => {
      try {
        const { db } = await import('@/firebase');
        const { collection, query, where, getDocs } = await import('firebase/firestore');

        const q = query(
          collection(db, 'challenges'),
          where('trackingId', '==', term)
        );

        const snap = await getDocs(q);
        if (!isSubscribed) return;

        if (!snap.empty) {
          const doc = snap.docs[0];
          setGlobalChallenge({
            id: doc.id,
            ...(doc.data() as Omit<FirestoreChallenge, 'id'>),
          });
        } else {
          setGlobalChallenge(null);
        }
      } catch (err) {
        console.error('[Global Tracking Search Error]', err);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [searchId]);

  // ── Real-Time Firestore Query for Current User ─────────────────────────────
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    (async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { db } = await import('@/firebase');
        const { collection, query, where, onSnapshot } = await import('firebase/firestore');

        // NOTE: Filtering by 'submittedBy' and ordering by 'submittedAt' in Firestore requires a composite index.
        // We query by 'submittedBy' to ensure instant reliability without index block.
        const q = query(
          collection(db, 'challenges'),
          where('submittedBy', '==', user.id)
        );

        unsubscribe = onSnapshot(
          q,
          (snap) => {
            const docs = snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<FirestoreChallenge, 'id'>),
            }));

            // Sort locally by date descending
            docs.sort((a, b) => {
              const tA = a.submittedAt?.toDate?.() ? a.submittedAt.toDate().getTime() : Date.now();
              const tB = b.submittedAt?.toDate?.() ? b.submittedAt.toDate().getTime() : Date.now();
              return tB - tA;
            });

            setUserChallenges(docs);
            setLoading(false);
          },
          (err) => {
            console.error('[Firestore Citizen Query]', err);
            setIndexNoteVisible(true);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('[Firestore Citizen Init]', err);
        setLoading(false);
      }
    })();

    return () => { unsubscribe?.(); };
  }, [user?.id]);

  // ── Filtered Challenges by Search ID / Keyword ─────────────────────────────
  const filteredChallenges = useMemo(() => {
    const list = [...userChallenges];
    if (globalChallenge && !list.some((c) => c.id === globalChallenge.id)) {
      list.unshift(globalChallenge);
    }

    if (!searchId.trim()) return list;
    const term = searchId.trim().toLowerCase();
    return list.filter((c) => {
      const matchId = (c.trackingId || '').toLowerCase().includes(term) || c.id.toLowerCase().includes(term);
      const matchTitle = c.title.toLowerCase().includes(term);
      const matchDistrict = c.district.toLowerCase().includes(term);
      return matchId || matchTitle || matchDistrict;
    });
  }, [userChallenges, searchId, globalChallenge]);

  const copyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* ── Welcome Header ── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-green-700 via-emerald-800 to-teal-900 text-white shadow-xl shadow-green-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-green-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Citizen Problem Monitoring Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">नमस्ते, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-green-200 text-xs sm:text-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {user?.district || 'Ranchi'}, Jharkhand · Registered Citizen
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/citizen/submit-problem')}
              className="px-4 py-3 rounded-2xl bg-white text-green-800 hover:bg-green-50 font-black text-xs shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-green-700" />
              <span>Submit Problem</span>
            </button>
            <button
              onClick={async () => { await logout(); router.replace('/'); }}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Track by ID Search Bar ── */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-green-700" />
          Track by ID / Search My Reports
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Paste your Tracking ID (e.g. JS-88A9F1) or search by keyword..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchId && (
            <button
              onClick={() => setSearchId('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Firestore Composite Index Note Warning (If triggered) ── */}
      {indexNoteVisible && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold space-y-1">
          <p className="font-extrabold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Firestore Composite Index Notice
          </p>
          <p>
            Filtering by <code>submittedBy</code> and ordering by <code>submittedAt</code> in Firestore requires a composite index.
            If your console throws an index error, click the generated link in your browser console to automatically build the index in Firebase Console.
          </p>
        </div>
      )}

      {/* ── My Reports Header & List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-green-700" />
            My Submitted Problems ({userChallenges.length})
          </h2>
          <button
            onClick={() => router.push('/citizen/submit-problem')}
            className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Submit New
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            <p className="text-sm font-semibold">Loading your submitted problems...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && userChallenges.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">No Problems Reported Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You haven't submitted any societal challenges. Report an issue in your village or town to get started.
              </p>
            </div>
            <button
              onClick={() => router.push('/citizen/submit-problem')}
              className="px-6 py-3.5 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-black text-sm shadow-md shadow-green-700/20 transition-all inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Your First Problem
            </button>
          </div>
        )}

        {/* Search Empty State */}
        {!loading && userChallenges.length > 0 && filteredChallenges.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm">
            <p className="text-sm font-bold text-slate-700">No report matching "{searchId}"</p>
            <button
              onClick={() => setSearchId('')}
              className="text-xs text-green-700 font-bold hover:underline"
            >
              Clear Search Filter
            </button>
          </div>
        )}

        {/* Challenge Cards with Progress Stepper */}
        {!loading && filteredChallenges.map((challenge) => {
          const submittedDate = challenge.submittedAt?.toDate?.()
            ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(
                challenge.submittedAt.toDate()
              )
            : 'Recently';

          return (
            <div
              key={challenge.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
            >
              {/* Card Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Tracking ID Badge */}
                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs font-black text-slate-800">
                    <span>{challenge.trackingId || challenge.id.slice(0, 8).toUpperCase()}</span>
                    <button
                      onClick={() => copyTrackingId(challenge.trackingId || challenge.id)}
                      className="p-1 hover:text-green-700 transition-colors"
                      title="Copy Tracking ID"
                    >
                      {copiedId === (challenge.trackingId || challenge.id) ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-green-50 text-green-800 text-[11px] font-bold border border-green-200 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {challenge.domain}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {challenge.district}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    {submittedDate}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {challenge.description}
                </p>
              </div>

              {/* 4-Step Progress Tracker */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Live Resolution Progress
                </p>
                <StatusTimeline challenge={challenge} />
              </div>

              {/* Assigned HEI / CSR Highlights */}
              {(challenge.assignedHEI || challenge.industryPartner) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {challenge.assignedHEI && (
                    <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 space-y-0.5">
                      <p className="font-extrabold flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                        {challenge.assignedHEI.heiName}
                      </p>
                      <p className="text-[11px] text-blue-800">Faculty Mentor: <strong>{challenge.assignedHEI.facultyMentor}</strong></p>
                      <p className="text-[11px] text-blue-800">Team: <strong>{challenge.assignedHEI.studentLead}</strong></p>
                    </div>
                  )}

                  {challenge.industryPartner && (
                    <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 space-y-0.5">
                      <p className="font-extrabold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-purple-700" />
                        {challenge.industryPartner.sponsorName}
                      </p>
                      <p className="text-[11px] text-purple-800 font-bold">
                        CSR Grant: ₹{((challenge.industryPartner.amountPledged || 350000) / 100000).toFixed(1)} Lakhs
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────

export default function CitizenDashboardPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['CITIZEN']}>
        <CitizenDashboardContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
