'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Shield,
  MapPin,
  TrendingUp,
  Building2,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Globe2,
} from 'lucide-react';

export default function PublicGovtLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-950 via-slate-900 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-orange-500 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span>Government Governance & Analytics Command Center</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Monitor State-Wide Innovation & <span className="text-amber-400">Fund Mobilization</span>
          </h1>

          <p className="hindi text-xl text-amber-300 font-semibold">
            राज्यव्यापी नवाचार और निधि जुटाने की निगरानी करें
          </p>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Real-time administrative command center monitoring 24-district problem submissions, university project adoption rates, CSR capital flows, and field deployment success across Jharkhand.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/govt/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-base shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
            >
              <span>Go to Govt Command Center</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key Features Grid ────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900">Governance & Data Analytics Capabilities</h2>
          <p className="text-slate-500 mt-2">Data-driven policy insights and cross-departmental coordination.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MapPin,
              title: '24-District Problem Heatmaps',
              desc: 'Visual geospatial distribution of crowdsourced complaints by district, block, and category.',
              color: 'text-amber-700 bg-amber-50 border-amber-200',
            },
            {
              icon: BarChart3,
              title: 'University R&D Index',
              desc: 'Track adoption efficiency and prototype delivery timelines across all participating HEIs.',
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              icon: Building2,
              title: 'CSR Inflow Monitoring',
              desc: 'Monitor corporate fund allocations under Schedule VII Section 135 across priority sectors.',
              color: 'text-purple-700 bg-purple-50 border-purple-200',
            },
            {
              icon: Shield,
              title: 'Policy Recommendation AI',
              desc: 'Automated synthesis of recurring regional challenges into policy action drafts.',
              color: 'text-green-700 bg-green-50 border-green-200',
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
          <h2 className="text-3xl font-black text-slate-900">Are You a District Officer or State Admin?</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Log in to view the interactive state command center dashboard and district heatmaps.
          </p>
          <Link
            href="/govt/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-base shadow-lg shadow-amber-700/20 transition-all"
          >
            <span>Enter Govt Command Center</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
