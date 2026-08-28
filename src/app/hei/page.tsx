'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  ChevronRight,
  Shield,
  FileCheck,
  Building2,
  Users,
} from 'lucide-react';

export default function PublicHeiLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Higher Education Institution (HEI) R&D Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Adopt Grassroots Problems for <span className="text-blue-400">NEP 2020 Experiential R&D Credits</span>
          </h1>

          <p className="hindi text-xl text-amber-300 font-semibold">
            NEP 2020 प्रायोगिक R&D क्रेडिट के लिए जमीनी समस्याओं को अपनाएं
          </p>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Empower faculty research teams and student innovators to solve verified, high-impact societal challenges submitted by Jharkhand citizens while fulfilling NEP 2020 academic credit requirements.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/hei/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5"
            >
              <span>Go to HEI Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key Benefits Grid ────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900">Why Universities Partner with JanSamadhan</h2>
          <p className="text-slate-500 mt-2">Bridge academic research with real-world civic impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: 'NEP 2020 Course Credits',
              desc: 'Convert student prototype development into official Capstone & Major Project credits.',
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              icon: Building2,
              title: 'CSR Grant Access',
              desc: 'Access corporate CSR Section 135 funding to build and field-test working prototypes.',
              color: 'text-purple-700 bg-purple-50 border-purple-200',
            },
            {
              icon: Award,
              title: 'Patent & IP Support',
              desc: 'Co-file patents with industry sponsors and receive incubation guidance.',
              color: 'text-green-700 bg-green-50 border-green-200',
            },
            {
              icon: Sparkles,
              title: 'NIRF Ranking Boost',
              desc: 'Improve institutional NIRF scores through verified community-centric innovations.',
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
          <h2 className="text-3xl font-black text-slate-900">Are You a University Faculty Member or Student Team Lead?</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Log in to browse open problem statements, form student R&D teams, and submit project proposals.
          </p>
          <Link
            href="/hei/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg shadow-blue-700/20 transition-all"
          >
            <span>Enter HEI Dashboard</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
