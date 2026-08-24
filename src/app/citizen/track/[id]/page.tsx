'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Users, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Building2, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  FileText,
  DollarSign,
  Award
} from 'lucide-react';
import { ChallengeItem, ProjectItem } from '@/types';
import { INITIAL_CHALLENGES, INITIAL_PROJECTS, INITIAL_GRANTS } from '@/lib/mockData';

export default function ChallengeTrackPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;

  const [challenge, setChallenge] = useState<ChallengeItem | null>(null);
  const [project, setProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const item = INITIAL_CHALLENGES.find(c => c.id === challengeId) || INITIAL_CHALLENGES[0];
    setChallenge(item);

    const proj = INITIAL_PROJECTS.find(p => p.challengeId === item.id) || INITIAL_PROJECTS[0];
    setProject(proj);
  }, [challengeId]);

  if (!challenge) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Nav */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Citizen Portal</span>
      </button>

      {/* Challenge Title Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
              {challenge.category}
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs">
              ID: #{challenge.id}
            </span>
          </div>

          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30 uppercase">
            Status: {challenge.status.replace('_', ' ')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">{challenge.title}</h1>
        
        <p className="text-sm text-slate-300 leading-relaxed">{challenge.description}</p>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {challenge.locationName}, {challenge.district}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-cyan-400" /> Reported by {challenge.reporterName}</span>
          <span className="text-red-400 font-bold">Urgency Rating: {challenge.urgencyScore}/100</span>
        </div>
      </div>

      {/* END-TO-END TIMELINE STAGES */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          End-to-End Lifecycle & Innovation Timeline
        </h2>

        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
          
          {/* Stage 1: Citizen Submission */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Stage 1 • Grassroots Reporting</div>
              <h3 className="text-base font-bold text-white mt-0.5">Problem Reported by Citizen</h3>
              <p className="text-xs text-slate-400 mt-1">Submitted with photo evidence & GPS coordinates. Upvoted by {challenge.upvotesCount} community members.</p>
            </div>
          </div>

          {/* Stage 2: AI Classification & Routing */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Stage 2 • AI Intelligence Engine</div>
              <h3 className="text-base font-bold text-white mt-0.5">Gemini AI Auto-Categorization & Matchmaking</h3>
              <p className="text-xs text-slate-400 mt-1">Deduplication scan completed. Routed to <strong className="text-cyan-300">{challenge.assignedUniversityName}</strong>.</p>
            </div>
          </div>

          {/* Stage 3: University R&D Proposal */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-lg">
              3
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Stage 3 • HEI R&D Project</div>
              <h3 className="text-base font-bold text-white">{project?.title || 'Jal-Shuddhi Bio-Filter'}</h3>
              <p className="text-xs text-slate-300">{project?.description}</p>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-900 flex flex-wrap items-center gap-4">
                <span>Faculty Mentor: <strong className="text-slate-200">{project?.facultyMentorName}</strong></span>
                <span>Team: <strong className="text-slate-200">{project?.teamName}</strong></span>
              </div>
            </div>
          </div>

          {/* Stage 4: Industry CSR Funding */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
              4
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Stage 4 • Industry CSR Sponsorship</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Tata Steel Foundation CSR Grant</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">₹ 3.5 Lakhs Disbursed</span>
              </div>
              <p className="text-xs text-slate-400">Co-funding allocated for pilot testing and 200L bio-filter manufacturing.</p>
            </div>
          </div>

          {/* Stage 5: Milestone & Patent Tracking */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-bold text-xs">
              5
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stage 5 • Field Pilot & Patent Filing</div>
              <h3 className="text-base font-bold text-white mt-0.5">Field Pilot Testing & Provisional Patent</h3>
              <p className="text-xs text-slate-400 mt-1">Currently deploying prototype in 3 Namkum schools. Patent application filed under Indian Patent Office.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
