'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Users, 
  GraduationCap, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Zap, 
  Award,
  TrendingUp,
  Cpu,
  FileCheck
} from 'lucide-react';
import AiProcessingModal from '@/components/AiProcessingModal';

export default function LandingPage() {
  const [showAiModal, setShowAiModal] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-xl shadow-cyan-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>AI-Driven Societal Innovation & HEI Collaboration Engine</span>
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-200 rounded-md font-mono text-[10px]">SIH 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Bridging Grassroots Problems with{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              University R&D & CSR Power
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
            A unified digital ecosystem to crowdsource community challenges across Jharkhand, deduplicate reports via AI, route them to specialized Higher Education Institutions (BIT Mesra, NIT Jamshedpur, IIT ISM Dhanbad), and accelerate pilot solutions with Industry CSR grants.
          </p>

          {/* Action Callouts */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/citizen/report"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 hover:scale-105 transition-transform duration-200 flex items-center justify-center space-x-3"
            >
              <Users className="w-5 h-5 text-slate-950" />
              <span>Report a Societal Problem</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </Link>

            <button
              onClick={() => setShowAiModal(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 shadow-xl"
            >
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span>Watch AI Routing Demo</span>
            </button>
          </div>

          {/* Live Impact Counters Banner */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-white">240+</div>
              <div className="text-xs text-slate-400 font-medium">Challenges Crowdsourced</div>
              <div className="mt-1 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Across 24 Districts
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-cyan-400">46</div>
              <div className="text-xs text-slate-400 font-medium">University R&D Projects</div>
              <div className="mt-1 text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> BIT Mesra, NIT & IIT ISM
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-indigo-400">₹ 1.42 Cr</div>
              <div className="text-xs text-slate-400 font-medium">CSR Funding Pledged</div>
              <div className="mt-1 text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Tata Steel, CIL, NTPC CSR
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-3xl font-black text-amber-400">12</div>
              <div className="text-xs text-slate-400 font-medium">Patents Applied</div>
              <div className="mt-1 text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                <FileCheck className="w-3 h-3" /> NEP 2020 R&D Outcomes
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 PERSONA MODULE SELECTOR SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">4-in-1 Ecosystem Architecture</h2>
          <p className="text-sm text-slate-400 mt-2">Select a persona portal below to evaluate tailored features for Smart India Hackathon.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Persona 1: Citizen */}
          <Link
            href="/citizen"
            className="group relative p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-500 transition-all duration-300 shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Citizen PWA Portal</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Geotag problem locations, upload media/voice notes, and track real-time status as universities work on your issue.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Explore Citizen View</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Persona 2: University */}
          <Link
            href="/university"
            className="group relative p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-500 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">HEI / University Portal</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Review AI-routed challenges matching faculty expertise, form student teams, and manage sprint deliverables.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
              <span>Explore HEI Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Persona 3: Industry CSR */}
          <Link
            href="/industry"
            className="group relative p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-500 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">Industry & CSR Hub</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Browse validated university R&D proposals, pledge CSR grants, and mentor pilot prototyping teams.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Explore CSR Marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Persona 4: Government */}
          <Link
            href="/admin"
            className="group relative p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-500 transition-all duration-300 shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">Govt Command Center</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Real-time district heatmaps, sector breakdown, patent tracking, and automated executive policy reports.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>Explore Analytics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* HOW IT WORKS / AI ENGINE EXPLAINER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">AI Intelligence Core</span>
              <h2 className="text-3xl font-extrabold text-white">How JanSamadhan AI Processes & Routes Challenges</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                When a citizen reports a problem (via voice or text), our engine uses Google Gemini API and vector similarity algorithms to eliminate duplicate tickets, assign urgency scores, and match the task to university labs.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><span className="font-bold text-white">Semantic Deduplication:</span> Automatically groups 50+ village complaints into 1 high-priority master ticket.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><span className="font-bold text-white">Smart Matchmaker:</span> Routes Water problems to BIT Mesra, Mining/Hydrogeology to IIT ISM Dhanbad, and Civil Engg to NIT Jamshedpur.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300"><span className="font-bold text-white">NEP 2020 Experiential Credit:</span> Students earn R&D credits & patent ownership for solving real societal challenges.</p>
                </div>
              </div>
            </div>

            {/* Interactive Demo Terminal Trigger Card */}
            <div className="w-full lg:w-96 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 text-left shadow-2xl relative">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3 mb-4 font-mono">
                <span>ai-router-terminal v2.4</span>
                <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> ONLINE</span>
              </div>
              <p className="text-xs text-cyan-300 font-mono mb-2">&gt; Input: "Arsenic in Namkum village handpumps"</p>
              <div className="space-y-2 font-mono text-[11px] text-slate-400">
                <p className="text-slate-300">[1] Tagged: Water Resources (Arsenic Filtration)</p>
                <p className="text-amber-400">[2] Urgency Score: 92/100 (Severe Health Risk)</p>
                <p className="text-emerald-400">[3] Match: BIT Mesra - Environmental Dept</p>
              </div>

              <button
                onClick={() => setShowAiModal(true)}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>Test Interactive AI Modal</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* AI PROCESSING MODAL FOR DEMO */}
      <AiProcessingModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        analysis={{
          category: 'Water Resources',
          subCategory: 'Heavy Metal Bio-Filtration',
          urgencyScore: 92,
          impactScore: 88,
          reasoning: 'Groundwater heavy metal contamination poses immediate health hazards to rural children. Assigned highest emergency priority rating.',
          recommendedDepartments: ['Environmental Engineering', 'Water Resource Mgmt', 'Chemical Technology'],
          duplicateMatchFound: false,
          matchedUniversityId: 'univ-1',
          matchedUniversityName: 'BIT Mesra (Birla Institute of Technology)',
        }}
        challengeTitle="High Arsenic & Lead Contamination in Groundwater Wells (Namkum)"
      />

    </div>
  );
}
