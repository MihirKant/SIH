'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  MapPin,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  ThumbsUp,
  Clock,
  ChevronRight,
  GraduationCap,
  Building2,
  LayoutDashboard,
} from 'lucide-react';

export default function PublicCitizenLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-900 via-slate-900 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-green-400" />
            <span>Citizen Empowerment Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Report Local Issues & <span className="text-green-400">Track Progress</span> in Real Time
          </h1>

          <p className="hindi text-xl text-amber-300 font-semibold">
            स्थानीय समस्याओं की रिपोर्ट करें और प्रगति को ट्रैक करें
          </p>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Voice your community challenges across water, agriculture, energy, and infrastructure. Our AI platform processes your report, clusters similar complaints, and routes them to University R&D labs for tangible solutions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/citizen/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black text-base shadow-xl shadow-green-600/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
            >
              <span>Go to Citizen Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key Features Grid ────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900">How Citizens Drive Change</h2>
          <p className="text-slate-500 mt-2">Simple, transparent, and direct connection to researchers and policymakers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MapPin,
              title: 'Geo-Tagged Reports',
              desc: 'Upload photos, voice notes, or documents with automatic GPS location verification.',
              color: 'text-green-700 bg-green-50 border-green-200',
            },
            {
              icon: Sparkles,
              title: 'AI Priority Scoring',
              desc: 'Smart algorithms deduplicate submissions and rank problems by public urgency.',
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              icon: GraduationCap,
              title: 'University Assignment',
              desc: 'Problems are routed directly to faculty & student researchers to build field prototypes.',
              color: 'text-purple-700 bg-purple-50 border-purple-200',
            },
            {
              icon: Clock,
              title: 'Live Tracking',
              desc: 'Follow problem status from open issue to prototype testing and full CSR deployment.',
              color: 'text-amber-700 bg-amber-50 border-amber-200',
            },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-black text-slate-900">Ready to Report a Problem in Your Village or Ward?</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Log in to submit new issues, vote on active community challenges, and view progress updates from assigned universities.
          </p>
          <Link
            href="/citizen/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-extrabold text-base shadow-lg shadow-green-700/20 transition-all"
          >
            <span>Enter Citizen Dashboard</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
