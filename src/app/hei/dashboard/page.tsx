'use client';

/**
 * src/app/hei/dashboard/page.tsx
 * ----------------------------------------------------------
 * HEI (Higher Education Institution) Dashboard
 *
 * Features:
 *  - Real-time Firestore onSnapshot for challenges collection
 *  - Filter bar: Domain, District, Status
 *  - Challenge cards grid with status badges
 *  - "Adopt Challenge" modal → writes assignedHEI + status update
 *  - Success toast notification
 * ----------------------------------------------------------
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute, RoleRoute } from '@/components/ProtectedRoute';
import {
  GraduationCap,
  Layers,
  MapPin,
  Search,
  Filter,
  X,
  CheckCircle2,
  Loader2,
  Clock,
  Zap,
  ChevronDown,
  Tag,
  Users,
  UserCheck,
  Lightbulb,
  CalendarDays,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  LogOut,
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────

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
  'Ranchi', 'Dhanbad', 'East Singhbhum', 'West Singhbhum',
  'Hazaribagh', 'Bokaro', 'Giridih', 'Deoghar', 'Dumka',
  'Palamu', 'Garhwa', 'Latehar', 'Chatra', 'Koderma',
  'Jamtara', 'Pakur', 'Godda', 'Sahibganj', 'Khunti',
  'Simdega', 'Lohardaga', 'Gumla', 'Saraikela-Kharsawan', 'Ramgarh',
];

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Pending AI Categorization', label: 'Pending' },
  { value: 'In Development', label: 'In Development' },
  { value: 'Resolved', label: 'Resolved' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface FirestoreChallenge {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  domain: string;
  district: string;
  status: string;
  submittedAt: any;
  submittedByName?: string;
  assignedHEI?: {
    facultyMentor: string;
    studentLead: string;
    solutionSummary: string;
    adoptedAt: any;
    heiName: string;
  } | null;
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; className: string; icon: any }> = {
    'Pending AI Categorization': {
      label: 'Pending R&D Team',
      className: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: Clock,
    },
    'In Development': {
      label: 'In Development',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Zap,
    },
    'Resolved': {
      label: 'Resolved',
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle2,
    },
  };

  const s = cfg[status] || {
    label: status,
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };
  const Icon = s.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${s.className}`}>
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

// ── Adopt Challenge Modal ─────────────────────────────────────────────────────

interface AdoptModalProps {
  challenge: FirestoreChallenge;
  heiName: string;
  onClose: () => void;
  onSuccess: (trackingId: string) => void;
}

function AdoptModal({ challenge, heiName, onClose, onSuccess }: AdoptModalProps) {
  const [facultyMentor, setFacultyMentor] = useState('');
  const [studentLead, setStudentLead] = useState('');
  const [solutionSummary, setSolutionSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdopt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyMentor.trim() || !studentLead.trim() || !solutionSummary.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { db } = await import('@/firebase');
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');

      const ref = doc(db, 'challenges', challenge.id);
        await updateDoc(ref, {
          status: 'In Development',
          assignedHEI: {
            name: heiName,
            heiName,
            facultyMentor: facultyMentor.trim(),
            studentLead: studentLead.trim(),
            teamName: `${heiName} Innovation Team`,
            budgetRequired: 350000,
            solutionSummary: solutionSummary.trim(),
            adoptedAt: serverTimestamp(),
          },
        });

      onSuccess(challenge.trackingId || challenge.id);
    } catch (err: any) {
      console.error('[Adopt Challenge]', err);
      setError('Failed to adopt challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-start justify-between flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-blue-200 text-[11px] font-bold uppercase tracking-widest">Adopt Challenge for R&D</p>
            <h2 className="text-base font-extrabold mt-0.5 line-clamp-2">{challenge.title}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] bg-blue-600/40 text-blue-100 px-2 py-0.5 rounded-lg">{challenge.domain}</span>
              <span className="text-[11px] bg-blue-600/40 text-blue-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" />{challenge.district}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-blue-200 hover:text-white hover:bg-blue-600 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAdopt} className="p-6 space-y-4 overflow-y-auto">
          {/* Problem snippet */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-700">Problem: </span>
            {challenge.description.slice(0, 180)}{challenge.description.length > 180 ? '…' : ''}
          </div>

          {/* Faculty Mentor */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              Faculty Mentor Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Anita Verma"
              value={facultyMentor}
              onChange={(e) => setFacultyMentor(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Student Lead */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Student Lead / Team Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Team AgroSense — Rohan, Priya, Amit"
              value={studentLead}
              onChange={(e) => setStudentLead(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Solution Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
              Proposed Solution Summary *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Briefly describe your team's proposed approach to solving this problem…"
              value={solutionSummary}
              onChange={(e) => setSolutionSummary(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !facultyMentor.trim() || !studentLead.trim() || !solutionSummary.trim()}
              className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-lg shadow-blue-700/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Adopting…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" />Adopt Challenge</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Success Toast ─────────────────────────────────────────────────────────────

function SuccessToast({ id, onDismiss }: { id: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/40 border border-slate-700 animate-slideUp min-w-[280px]">
      <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-black">Challenge Adopted!</p>
        <p className="text-xs text-slate-400">Status updated to <span className="text-blue-400 font-bold">In Development</span></p>
      </div>
      <button onClick={onDismiss} className="ml-2 text-slate-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Challenge Card ────────────────────────────────────────────────────────────

function ChallengeCard({
  challenge,
  onAdopt,
}: {
  challenge: FirestoreChallenge;
  onAdopt: (c: FirestoreChallenge) => void;
}) {
  const isAdopted = challenge.status === 'In Development';
  const submittedDate = challenge.submittedAt?.toDate?.()
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(
        challenge.submittedAt.toDate()
      )
    : 'Recently';

  return (
    <div className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all flex flex-col ${isAdopted ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'}`}>
      <div className="p-5 flex-1 space-y-3">
        {/* Top row: domain tag + status */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
            <Tag className="w-3 h-3" />{challenge.domain}
          </span>
          <StatusBadge status={challenge.status} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
          {challenge.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {challenge.description}
        </p>

        {/* Meta: district + date */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />{challenge.district}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />{submittedDate}
          </span>
        </div>

        {/* Adopted-by info */}
        {isAdopted && challenge.assignedHEI && (
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 space-y-0.5">
            <p className="font-bold flex items-center gap-1">
              <UserCheck className="w-3 h-3" /> {challenge.assignedHEI.heiName}
            </p>
            <p>Mentor: {challenge.assignedHEI.facultyMentor}</p>
            <p>Team: {challenge.assignedHEI.studentLead}</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        {isAdopted ? (
          <div className="w-full py-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Already Adopted
          </div>
        ) : (
          <button
            onClick={() => onAdopt(challenge)}
            className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 group"
          >
            <GraduationCap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Adopt Challenge for R&D
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

function HeiDashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Data state
  const [challenges, setChallenges] = useState<FirestoreChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState('');

  // Filter state
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal & toast state
  const [adoptTarget, setAdoptTarget] = useState<FirestoreChallenge | null>(null);
  const [toastId, setToastId] = useState<string | null>(null);

  // ── Firestore real-time listener ─────────────────────────────────────────

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const { db } = await import('@/firebase');
        const {
          collection,
          query,
          orderBy,
          onSnapshot,
        } = await import('firebase/firestore');

        const q = query(
          collection(db, 'challenges'),
          orderBy('submittedAt', 'desc')
        );

        unsubscribe = onSnapshot(
          q,
          (snap) => {
            const docs = snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<FirestoreChallenge, 'id'>),
            }));
            setChallenges(docs);
            setLoading(false);
          },
          (err) => {
            console.error('[Firestore onSnapshot]', err);
            setFirestoreError('Could not load challenges. Please refresh.');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('[Firestore init]', err);
        setFirestoreError('Firestore not available.');
        setLoading(false);
      }
    })();

    return () => { unsubscribe?.(); };
  }, []);

  // ── Client-side filtering ────────────────────────────────────────────────

  const filtered = challenges.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase());
    const matchDomain = domainFilter === 'All Domains' || c.domain === domainFilter;
    const matchDistrict = districtFilter === 'All Districts' || c.district === districtFilter;
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchDomain && matchDistrict && matchStatus;
  });

  const adoptedCount = challenges.filter((c) => c.status === 'In Development').length;
  const pendingCount = challenges.filter((c) => c.status === 'Pending AI Categorization').length;

  const handleAdoptSuccess = useCallback((trackingId: string) => {
    setAdoptTarget(null);
    setToastId(trackingId);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Adopt Modal */}
      {adoptTarget && (
        <AdoptModal
          challenge={adoptTarget}
          heiName={user?.organization || 'University'}
          onClose={() => setAdoptTarget(null)}
          onSuccess={handleAdoptSuccess}
        />
      )}

      {/* Success Toast */}
      {toastId && (
        <SuccessToast id={toastId} onDismiss={() => setToastId(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-700" />
              Challenges Board
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.organization || 'HEI Portal'} · Adopt open problems for R&D
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
              {pendingCount} Pending
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black">
              {adoptedCount} In Dev
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

        {/* ── Welcome banner ── */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg flex-shrink-0">
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
              : (user?.name?.[0] || 'U')
            }
          </div>
          <div>
            <p className="text-sm font-black">Welcome, {user?.name?.split(' ')[0]} 🎓</p>
            <p className="text-blue-200 text-xs">{user?.role === 'UNIVERSITY_STUDENT' ? 'Student Researcher' : 'Faculty / HEI Lead'} · {challenges.length} challenges available</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <button
              onClick={() => router.push('/university')}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Full Board
            </button>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description, or district…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown filters */}
          <div className="flex flex-wrap gap-2">
            {/* Domain */}
            <div className="relative">
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
              >
                {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* District */}
            <div className="relative">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
              >
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
              >
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Clear filters */}
            {(domainFilter !== 'All Domains' || districtFilter !== 'All Districts' || statusFilter !== 'all' || search) && (
              <button
                onClick={() => { setDomainFilter('All Domains'); setDistrictFilter('All Districts'); setStatusFilter('all'); setSearch(''); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <X className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-400 font-semibold">
            <Filter className="w-3 h-3 inline mr-1" />
            Showing <span className="font-black text-slate-600">{filtered.length}</span> of {challenges.length} challenges
          </p>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-semibold">Loading challenges from Firestore…</p>
          </div>
        )}

        {/* ── Firestore Error ── */}
        {firestoreError && !loading && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-3">
            <X className="w-5 h-5 flex-shrink-0" />
            <span>{firestoreError}</span>
            <button
              onClick={() => window.location.reload()}
              className="ml-auto flex items-center gap-1 text-xs font-bold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !firestoreError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Layers className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-600">No challenges match your filters</p>
            <p className="text-xs text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* ── Challenge Cards Grid ── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                onAdopt={setAdoptTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Slide-up animation */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </>
  );
}

// ── Page Export ───────────────────────────────────────────────────────────────

export default function HeiDashboardPage() {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['UNIVERSITY_FACULTY', 'UNIVERSITY_STUDENT']}>
        <HeiDashboardContent />
      </RoleRoute>
    </ProtectedRoute>
  );
}
