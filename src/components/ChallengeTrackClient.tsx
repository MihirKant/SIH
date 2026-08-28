'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Building2,
  Award,
} from 'lucide-react';
import { ChallengeItem, ProjectItem } from '@/types';
import { INITIAL_CHALLENGES, INITIAL_PROJECTS } from '@/lib/mockData';

export default function ChallengeTrackClient({ challengeId }: { challengeId: string }) {
  const router = useRouter();

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-green-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Citizen Portal</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Tracking ID: #{challenge.id}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Challenge Summary Banner */}
        <div className="civic-card border border-slate-200 p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
              {challenge.category}
            </span>
            <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700 font-extrabold text-xs border border-green-200 uppercase">
              Status: {challenge.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{challenge.title}</h1>
          <p className="text-sm text-slate-600 leading-relaxed">{challenge.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-green-600" /> {challenge.locationName}, {challenge.district}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-600" /> Reported by {challenge.reporterName}</span>
            <span className="text-red-600 font-bold">Urgency Rating: {challenge.urgencyScore}/100</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="civic-card border border-slate-200 p-8 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-700" />
            End-to-End Lifecycle & Innovation Timeline
          </h2>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
            {/* Stage 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-xs shadow-md">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Stage 1 • Grassroots Reporting</div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Problem Reported by Citizen</h3>
                <p className="text-xs text-slate-500 mt-1">Submitted with photo evidence & GPS coordinates. Upvoted by {challenge.upvotesCount} community members.</p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Stage 2 • AI Intelligence Engine</div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">AI Auto-Categorization & Matchmaking</h3>
                <p className="text-xs text-slate-500 mt-1">Deduplication scan completed. Routed to <strong className="text-blue-800">{challenge.assignedUniversityName}</strong>.</p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                3
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Stage 3 • HEI R&D Project</div>
                <h3 className="text-base font-bold text-slate-900">{project?.title || 'Jal-Shuddhi Bio-Filter'}</h3>
                <p className="text-xs text-slate-600">{project?.description}</p>
                <div className="text-xs text-slate-500 pt-2 border-t border-purple-200 flex flex-wrap items-center gap-4">
                  <span>Faculty Mentor: <strong className="text-slate-800">{project?.facultyMentorName}</strong></span>
                  <span>Team: <strong className="text-slate-800">{project?.teamName}</strong></span>
                </div>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                4
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Stage 4 • Industry CSR Sponsorship</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Tata Steel Foundation CSR Grant</span>
                  <span className="px-2.5 py-0.5 rounded bg-green-100 text-green-700 font-mono font-bold text-xs border border-green-200">₹ 3.5 Lakhs Disbursed</span>
                </div>
                <p className="text-xs text-slate-600">Co-funding allocated for pilot testing and bio-filter manufacturing.</p>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-200 border border-slate-300 text-slate-600 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage 5 • Field Pilot & Patent Filing</div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Field Pilot Testing & Provisional Patent</h3>
                <p className="text-xs text-slate-500 mt-1">Currently deploying prototype in 3 Namkum schools. Patent application filed under Indian Patent Office.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
