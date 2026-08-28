'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  IndianRupee,
  Shield,
  FileCheck,
  Sparkles,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Award,
  TrendingUp,
} from 'lucide-react';

export default function PublicIndustryLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-950 via-slate-900 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Corporate Social Responsibility (CSR) Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Fulfill CSR Obligations & <span className="text-purple-400">Scale University DeepTech Solutions</span>
          </h1>

          <p className="hindi text-xl text-amber-300 font-semibold">
            CSR दायित्वों को पूरा करें और विश्वविद्यालय समाधानों को स्केल करें
          </p>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Channel Section 135 CSR capital into vetted university prototypes addressing Jharkhand's key socio-economic challenges in water, agriculture, energy, and healthcare.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/industry/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-base shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
            >
              <span>Go to Industry & CSR Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key Benefits Grid ────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900">Why Corporates Invest via JanSamadhan</h2>
          <p className="text-slate-500 mt-2">Transparent, compliant, and measurable CSR impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileCheck,
              title: 'Schedule VII Compliant',
              desc: '100% compliant with Companies Act Section 135 CSR guidelines for technology incubators.',
              color: 'text-purple-700 bg-purple-50 border-purple-200',
            },
            {
              icon: GraduationCap,
              title: 'Vetted R&D Prototypes',
              desc: 'Fund prototypes developed by premier university faculty and top student researchers.',
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              icon: TrendingUp,
              title: 'Milestone-Based Releases',
              desc: 'Tranche disbursements linked to verified lab results and field validation milestones.',
              color: 'text-green-700 bg-green-50 border-green-200',
            },
            {
              icon: Award,
              title: 'Joint IP & Commercialization',
              desc: 'Co-own patents and gain first-right commercialization rights for scaled market deployment.',
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
          <h2 className="text-3xl font-black text-slate-900">Looking to Pledge CSR Funds for High-Impact Projects?</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Access the CSR Marketplace to browse validated university R&D projects and commit funding.
          </p>
          <Link
            href="/industry/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base shadow-lg shadow-purple-700/20 transition-all"
          >
            <span>Enter Industry Dashboard</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
