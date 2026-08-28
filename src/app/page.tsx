'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  Building2,
  LayoutDashboard,
  Cpu,
  MapPin,
  Upload,
  ArrowRight,
  TrendingUp,
  IndianRupee,
  Lightbulb,
  CheckCircle2,
  Clock,
  Droplets,
  Wheat,
  Zap,
  Heart,
  ChevronRight,
  Star,
  Shield,
  BookOpen,
  Globe2,
  PhoneCall,
  Mail,
  ExternalLink,
  Sparkles,
  BarChart3,
  Layers,
  Award,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

// ─── Stats Data ───────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: Users,
    value: 14820,
    suffix: '+',
    label: 'Challenges Crowdsourced',
    labelHi: 'चुनौतियाँ दर्ज',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  {
    icon: GraduationCap,
    value: 312,
    suffix: '',
    label: 'Active HEI Projects',
    labelHi: 'सक्रिय शोध परियोजनाएं',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: IndianRupee,
    value: 48,
    suffix: ' Cr+',
    label: 'CSR Funding Pledged',
    labelHi: 'CSR फंडिंग प्रतिबद्ध',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    icon: CheckCircle2,
    value: 96,
    suffix: '',
    label: 'Solutions Deployed',
    labelHi: 'समाधान तैनात',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
];

// ─── How It Works Steps ───────────────────────────────────────────────────────
const STEPS = [
  {
    step: '01',
    icon: MapPin,
    title: 'Citizen Submits',
    titleHi: 'नागरिक दर्ज करें',
    desc: 'Upload photos, voice notes, or video with precise geo-location via our mobile-first portal.',
    color: 'bg-green-700',
    lightBg: 'bg-green-50',
    border: 'border-green-200',
    accent: 'text-green-700',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'AI Processing',
    titleHi: 'AI विश्लेषण',
    desc: 'Our AI auto-categorises, deduplicates, and priority-scores problems by urgency and impact.',
    color: 'bg-blue-700',
    lightBg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-700',
  },
  {
    step: '03',
    icon: GraduationCap,
    title: 'University R&D',
    titleHi: 'विश्वविद्यालय अनुसंधान',
    desc: 'HEIs form multidisciplinary teams, submit proposals, and earn NEP 2020 experiential credits.',
    color: 'bg-purple-700',
    lightBg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: 'text-purple-700',
  },
  {
    step: '04',
    icon: Building2,
    title: 'Industry & CSR',
    titleHi: 'उद्योग & CSR',
    desc: 'Corporate sponsors fund prototypes through CSR Section 135, and deploy proven solutions at scale.',
    color: 'bg-amber-600',
    lightBg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: 'text-amber-700',
  },
];

// ─── Open Challenges ──────────────────────────────────────────────────────────
const CHALLENGES = [
  {
    id: 1,
    title: 'Arsenic Contamination in Drinking Water Wells',
    titleHi: 'पीने के पानी में आर्सेनिक',
    district: 'Sahebganj District',
    submittedBy: 'Ramesh Murmu',
    daysAgo: 2,
    tags: ['Water Management', 'Public Health'],
    tagColors: ['bg-blue-100 text-blue-700', 'bg-red-100 text-red-700'],
    icon: Droplets,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    upvotes: 284,
    assignedTo: 'Pending Review',
    urgency: 'High',
    urgencyColor: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    id: 2,
    title: 'Maize Leaf Blight Destroying Kharif Crop Yields',
    titleHi: 'मक्के की फसल में पत्ती झुलसा रोग',
    district: 'Gumla District',
    submittedBy: 'Sunita Devi',
    daysAgo: 4,
    tags: ['Agriculture', 'Crop Science'],
    tagColors: ['bg-green-100 text-green-700', 'bg-lime-100 text-lime-700'],
    icon: Wheat,
    iconColor: 'text-green-700',
    iconBg: 'bg-green-50',
    upvotes: 197,
    assignedTo: 'BIT Mesra — Pending',
    urgency: 'Medium',
    urgencyColor: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    id: 3,
    title: 'No Electricity in 14 Villages for 60+ Days',
    titleHi: '14 गाँवों में 60 दिनों से बिजली नहीं',
    district: 'Latehar District',
    submittedBy: 'Birsa Pradhan',
    daysAgo: 7,
    tags: ['Energy Access', 'Rural Infrastructure'],
    tagColors: ['bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700'],
    icon: Zap,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
    upvotes: 451,
    assignedTo: 'NIT Jamshedpur',
    urgency: 'Critical',
    urgencyColor: 'bg-red-100 text-red-800 border-red-300',
  },
];

// ─── Hero SVG Illustration ────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 360" fill="none" className="w-full h-full max-w-lg mx-auto">
      {/* Background circles */}
      <circle cx="240" cy="180" r="160" fill="#f0fdf4" />
      <circle cx="240" cy="180" r="120" fill="#dcfce7" />

      {/* ── Citizen with phone (left) ────────────────────────────────────── */}
      <g transform="translate(60, 120)">
        {/* Person body */}
        <circle cx="40" cy="20" r="16" fill="#d97706" />
        <rect x="22" y="38" width="36" height="50" rx="8" fill="#166534" />
        {/* Phone in hand */}
        <rect x="52" y="50" width="28" height="44" rx="5" fill="#1e293b" />
        <rect x="55" y="56" width="22" height="30" rx="3" fill="#4ade80" />
        {/* Camera icon on phone */}
        <circle cx="66" cy="68" r="5" fill="#166534" />
        <circle cx="66" cy="68" r="3" fill="#86efac" />
        {/* Location pin */}
        <path d="M66 40 L66 50" stroke="#ef4444" strokeWidth="2" />
        <circle cx="66" cy="38" r="4" fill="#ef4444" />
        <text x="24" y="104" fontFamily="sans-serif" fontSize="9" fill="#166534" fontWeight="700">Citizen</text>
        <text x="18" y="114" fontFamily="sans-serif" fontSize="7" fill="#6b7280">समस्या दर्ज करें</text>
      </g>

      {/* ── AI Processing Node (center) ───────────────────────────────────── */}
      <g transform="translate(188, 110)">
        <circle cx="52" cy="70" r="48" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
        <circle cx="52" cy="70" r="36" fill="#dbeafe" />
        {/* Gear / AI symbol */}
        <circle cx="52" cy="70" r="16" fill="#1d4ed8" />
        <text x="44" y="74" fontFamily="monospace" fontSize="12" fill="white" fontWeight="800">AI</text>
        {/* Radiating lines */}
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line
            key={i}
            x1={52 + 20 * Math.cos((deg * Math.PI) / 180)}
            y1={70 + 20 * Math.sin((deg * Math.PI) / 180)}
            x2={52 + 34 * Math.cos((deg * Math.PI) / 180)}
            y2={70 + 34 * Math.sin((deg * Math.PI) / 180)}
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        <text x="22" y="130" fontFamily="sans-serif" fontSize="8.5" fill="#1d4ed8" fontWeight="700">AI Categorisation</text>
      </g>

      {/* ── University Building (right) ───────────────────────────────────── */}
      <g transform="translate(340, 105)">
        {/* Building */}
        <rect x="10" y="40" width="80" height="70" rx="4" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5" />
        <rect x="20" y="20" width="60" height="24" rx="2" fill="#7c3aed" />
        {/* Columns */}
        {[24, 36, 48, 60, 72].map((x) => (
          <rect key={x} x={x} y="44" width="6" height="52" rx="2" fill="#c4b5fd" />
        ))}
        {/* Windows */}
        <rect x="25" y="56" width="12" height="14" rx="2" fill="#a78bfa" />
        <rect x="46" y="56" width="12" height="14" rx="2" fill="#a78bfa" />
        <rect x="67" y="56" width="12" height="14" rx="2" fill="#a78bfa" />
        {/* Door */}
        <rect x="40" y="86" width="20" height="24" rx="2" fill="#7c3aed" />
        {/* Pennant */}
        <line x1="50" y1="8" x2="50" y2="22" stroke="#7c3aed" strokeWidth="2" />
        <polygon points="50,8 66,14 50,20" fill="#fbbf24" />
        <text x="10" y="124" fontFamily="sans-serif" fontSize="8.5" fill="#7c3aed" fontWeight="700">HEI / University</text>
      </g>

      {/* ── Flow Arrows ───────────────────────────────────────────────────── */}
      {/* Citizen → AI */}
      <path
        d="M 158 178 Q 190 160 200 175"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeDasharray="5 3"
        markerEnd="url(#arrowG)"
        fill="none"
      />
      {/* AI → University */}
      <path
        d="M 293 178 Q 325 160 340 175"
        stroke="#1d4ed8"
        strokeWidth="2.5"
        strokeDasharray="5 3"
        markerEnd="url(#arrowB)"
        fill="none"
      />

      {/* ── Small floating badge: "NEP 2020 Credit" ──────────────────────── */}
      <g transform="translate(190, 240)">
        <rect width="100" height="26" rx="13" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
        <text x="12" y="17" fontFamily="sans-serif" fontSize="9" fill="#92400e" fontWeight="700">⭐ NEP 2020 Credits</text>
      </g>

      {/* ── Small floating badge: "CSR Funded" ───────────────────────────── */}
      <g transform="translate(20, 255)">
        <rect width="86" height="26" rx="13" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
        <text x="10" y="17" fontFamily="sans-serif" fontSize="9" fill="#166534" fontWeight="700">✓ CSR Funded</text>
      </g>

      {/* ── Defs ─────────────────────────────────────────────────────────── */}
      <defs>
        <marker id="arrowG" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#16a34a" />
        </marker>
        <marker id="arrowB" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#1d4ed8" />
        </marker>
      </defs>
    </svg>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Route authenticated citizens directly to the form;
  // open the login modal for guests (ProtectedRoute also guards the form)
  const handleReportClick = () => {
    if (isAuthenticated) {
      router.push('/citizen/submit-problem');
    } else {
      openAuthModal('CITIZEN', 'login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ════════════════════════════════════════════════════════════════════
          § 1 · HERO SECTION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle radial background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-100 rounded-full opacity-40 -translate-x-1/3 -translate-y-1/3 blur-3xl" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100 rounded-full opacity-40 translate-x-1/3 -translate-y-1/3 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Copy */}
            <div className="order-2 lg:order-1">
              {/* Official badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-6">
                <Shield className="w-4 h-4 text-green-700" />
                <span className="text-xs font-bold text-green-800 uppercase tracking-wider">
                  Official Jharkhand Government Initiative
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
                Empowering Jharkhand:{' '}
                <span className="shimmer-text">
                  From Grassroots Challenges
                </span>{' '}
                to Global Innovations.
              </h1>

              {/* Hindi sub-headline */}
              <p className="hindi text-lg text-amber-700 font-semibold mb-3">
                जड़ों से जुड़ी समस्याएं — वैश्विक समाधान
              </p>

              <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-xl">
                A unified AI-driven platform connecting citizens with universities
                and industry to solve societal challenges across Jharkhand.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/citizen"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-green-700 hover:bg-green-800 text-white rounded-2xl text-base font-bold shadow-lg shadow-green-700/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <MapPin className="w-5 h-5" />
                  <span>
                    Report a Local Problem
                    <span className="block text-xs hindi font-normal opacity-80 mt-0.5">समस्या दर्ज करें</span>
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/industry"
                  className="group flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 rounded-2xl text-base font-bold transition-all duration-200 hover:border-green-400 hover:-translate-y-0.5"
                >
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <span>Explore Active Projects</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-400" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>NEP 2020 Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>CSR Section 135 Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Open to All Citizens</span>
                </div>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="order-1 lg:order-2 float-slow">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 2 · IMPACT STATS STRIP
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
            Real-Time Platform Impact
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`civic-card p-6 text-center border ${stat.border}`}
                >
                  <div className={`w-12 h-12 ${stat.bg} ${stat.border} border rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl lg:text-4xl font-black ${stat.color} mb-1`}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{stat.label}</p>
                  <p className="text-xs hindi text-slate-400 mt-0.5">{stat.labelHi}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 3 · HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700 uppercase tracking-wider mb-4">
              Platform Workflow
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900">
              How JanSamadhan Works
            </h2>
            <p className="hindi text-amber-700 font-semibold mt-2 text-lg">जन समाधान कैसे काम करता है</p>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              From a citizen's smartphone to a deployed solution — every step powered by AI and collaboration.
            </p>
          </div>

          {/* Steps pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Horizontal connector (desktop only) */}
            <div className="hidden lg:block absolute top-12 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 bg-gradient-to-r from-green-300 via-blue-300 to-amber-300 z-0" />

            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative z-10">
                  <div className={`civic-card p-6 border ${step.border} text-center h-full`}>
                    {/* Step number badge */}
                    <div className="flex items-center justify-center mb-4">
                      <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center shadow-md`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className={`text-xs font-black uppercase tracking-widest ${step.accent} mb-2`}>
                      Step {step.step}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className={`text-xs hindi font-semibold ${step.accent} mb-3`}>{step.titleHi}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                  {/* Arrow between steps (mobile) */}
                  {idx < STEPS.length - 1 && (
                    <div className="lg:hidden flex justify-center my-2">
                      <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 4 · OPEN CHALLENGES FEED
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">Live Feed</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">Open Challenges</h2>
              <p className="hindi text-amber-700 font-semibold mt-1">खुली चुनौतियाँ — प्रायोजन के लिए उपलब्ध</p>
            </div>
            <Link
              href="/citizen"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:border-green-400 hover:text-green-700 transition-colors"
            >
              View All <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHALLENGES.map((challenge) => {
              const Icon = challenge.icon;
              return (
                <div key={challenge.id} className="civic-card p-6 flex flex-col gap-4 border border-slate-200">

                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${challenge.iconBg} flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${challenge.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${challenge.urgencyColor} mb-2`}>
                        {challenge.urgency} Priority
                      </div>
                      <h3 className="font-bold text-slate-900 leading-snug text-sm">
                        {challenge.title}
                      </h3>
                      <p className="hindi text-xs text-slate-500 mt-0.5">{challenge.titleHi}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{challenge.district}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{challenge.daysAgo}d ago</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-700 font-semibold">{challenge.upvotes}</span>
                    </div>
                  </div>

                  {/* AI-generated tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-500" /> AI Tags:
                    </span>
                    {challenge.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${challenge.tagColors[i]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Assigned To</p>
                      <p className="text-xs font-semibold text-slate-700">{challenge.assignedTo}</p>
                    </div>
                  </div>

                  {/* Sponsor CTA */}
                  <Link
                    href="/industry/dashboard"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-bold text-sm transition-all duration-200 group"
                  >
                    <IndianRupee className="w-4 h-4" />
                    Sponsor This Project
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 5 · MODULE SHORTCUTS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-10">
            Access Your Module
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                href: '/citizen',
                icon: Users,
                title: 'Citizen Portal',
                titleHi: 'नागरिक पोर्टल',
                desc: 'Report problems, track status, vote on challenges',
                bg: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-400',
                iconBg: 'bg-green-700',
                text: 'text-green-900',
              },
              {
                href: '/hei',
                icon: GraduationCap,
                title: 'HEI / University',
                titleHi: 'विश्वविद्यालय',
                desc: 'Build R&D teams, submit proposals, earn NEP credits',
                bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400',
                iconBg: 'bg-blue-700',
                text: 'text-blue-900',
              },
              {
                href: '/industry',
                icon: Building2,
                title: 'Industry & CSR',
                titleHi: 'उद्योग & CSR',
                desc: 'Fund projects, co-develop prototypes, deploy solutions',
                bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400',
                iconBg: 'bg-purple-700',
                text: 'text-purple-900',
              },
              {
                href: '/govt',
                icon: LayoutDashboard,
                title: 'Govt Analytics',
                titleHi: 'सरकारी विश्लेषण',
                desc: 'District heatmaps, sector metrics & policy insights',
                bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-400',
                iconBg: 'bg-amber-600',
                text: 'text-amber-900',
              },
            ].map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className={`civic-card p-6 border flex flex-col gap-3 transition-all duration-200 ${mod.bg}`}
                >
                  <div className={`w-12 h-12 ${mod.iconBg} rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${mod.text}`}>{mod.title}</h3>
                    <p className={`text-xs hindi font-semibold ${mod.text} opacity-70 mb-1`}>{mod.titleHi}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mt-auto group-hover:gap-2 transition-all">
                    Enter Portal <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 6 · FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0f2a1a] text-white">
        {/* Top footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 bg-[#FF9933]" />
                    <div className="flex-1 bg-white" />
                    <div className="flex-1 bg-[#138808]" />
                  </div>
                </div>
                <div>
                  <p className="font-black text-lg text-white">JanSamadhan</p>
                  <p className="hindi text-amber-400 text-xs font-semibold">जन समाधान</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empowering communities through university R&D and industry CSR partnerships. A Jharkhand Government initiative.
              </p>
              {/* Compliance Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['NEP 2020', 'CSR §135', 'DPIIT Recognised', 'ISO 27001'].map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-900/60 border border-green-700 text-green-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  ['Citizen Portal', '/citizen'],
                  ['Report a Problem', '/citizen'],
                  ['University Dashboard', '/hei'],
                  ['Industry & CSR', '/industry'],
                  ['Govt Analytics', '/govt'],
                  ['About JanSamadhan', '/'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-slate-400 hover:text-green-400 text-sm transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nodal Agency */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Nodal Agency</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5 text-slate-400">
                  <Shield className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Jharkhand Education Project Council</p>
                    <p className="text-xs">Dept. of Higher & Technical Education</p>
                    <p className="text-xs">Govt. of Jharkhand</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <PhoneCall className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">0651-2400757</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">help@jansamadhan.jharkhand.gov.in</span>
                </div>
              </div>
            </div>

            {/* Compliance & Partners */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Policy Framework</h4>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, label: 'NEP 2020 Compliance', desc: 'Experiential credit framework' },
                  { icon: Award, label: 'CSR Section 135', desc: 'Companies Act funding route' },
                  { icon: Globe2, label: 'SDG Aligned', desc: 'UN Sustainable Dev. Goals' },
                  { icon: BarChart3, label: 'NIRF Metrics', desc: 'University ranking integration' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-green-900/60 border border-green-700 rounded-lg flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{item.label}</p>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer bar */}
        <div className="border-t border-green-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © 2025 JanSamadhan | जन समाधान — Jharkhand Societal Innovation Portal. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link href="/citizen/dashboard" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
              <span>·</span>
              <Link href="/citizen/dashboard" className="hover:text-green-400 transition-colors">Terms of Use</Link>
              <span>·</span>
              <Link href="/citizen/dashboard" className="hover:text-green-400 transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
