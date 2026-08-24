'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  FileText, 
  DollarSign, 
  Sparkles, 
  Building2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { INITIAL_UNIVERSITIES, INITIAL_CHALLENGES, INITIAL_PROJECTS } from '@/lib/mockData';
import { ProjectItem, ChallengeItem } from '@/types';

export default function UniversityPortalPage() {
  const [selectedUniv, setSelectedUniv] = useState(INITIAL_UNIVERSITIES[0]);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);
  
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeItem | null>(null);

  // Proposal form state
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDesc, setProposalDesc] = useState('');
  const [facultyMentor, setFacultyMentor] = useState('Prof. Dr. Animesh Dutta');
  const [teamName, setTeamName] = useState('BIT Mesra Innovators');
  const [studentMembers, setStudentMembers] = useState('Aarav Sharma, Priya Hansda');
  const [budgetRequired, setBudgetRequired] = useState('350000');

  const routedChallenges = challenges.filter(c => 
    !c.assignedUniversityId || c.assignedUniversityId === selectedUniv.id
  );

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge || !proposalTitle) return;

    const newProj: ProjectItem = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      title: proposalTitle,
      description: proposalDesc,
      challengeId: selectedChallenge.id,
      challengeTitle: selectedChallenge.title,
      universityId: selectedUniv.id,
      universityName: selectedUniv.name,
      facultyMentorName: facultyMentor,
      teamName: teamName,
      teamMembers: studentMembers.split(',').map(s => s.trim()),
      status: 'APPROVED',
      budgetRequired: parseFloat(budgetRequired) || 250000,
      budgetFunded: 0,
      patentStatus: 'NONE',
      milestones: [
        { id: 'm-1', title: 'Lab Simulation & Benchmark Testing', dueDate: '2026-09-15', status: 'IN_PROGRESS' },
        { id: 'm-2', title: 'Prototype Fabrication', dueDate: '2026-10-10', status: 'PENDING' },
        { id: 'm-3', title: 'Field Pilot Deployment', dueDate: '2026-11-01', status: 'PENDING' }
      ],
      createdAt: new Date().toISOString(),
    };

    setProjects([newProj, ...projects]);
    setShowProposalModal(false);
    setProposalTitle('');
    setProposalDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* HEI Banner & Selector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/30 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-cyan-400 uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>Higher Education Institution (HEI) R&D Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white">{selectedUniv.name}</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Review AI-routed grassroots problems matching faculty departments ({selectedUniv.departments.slice(0, 3).join(', ')}), assemble multidisciplinary student teams, and earn NEP 2020 R&D credits.
          </p>
        </div>

        {/* Institution Dropdown Selector */}
        <div className="flex flex-col space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 self-start lg:self-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Switch Active HEI Institution:</span>
          <select
            value={selectedUniv.id}
            onChange={(e) => {
              const u = INITIAL_UNIVERSITIES.find(x => x.id === e.target.value);
              if (u) setSelectedUniv(u);
            }}
            className="bg-slate-900 text-cyan-300 font-bold text-sm border border-slate-700 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            {INITIAL_UNIVERSITIES.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.district})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Routed Challenges Inbox + Active R&D Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI-Routed Challenges Inbox (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Routed Challenges Inbox
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              {routedChallenges.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {routedChallenges.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold">{c.category}</span>
                  <span className="text-red-400 font-bold">Urgency: {c.urgencyScore}/100</span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2">{c.title}</h3>
                
                <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">District: {c.district}</span>

                  <button
                    onClick={() => {
                      setSelectedChallenge(c);
                      setProposalTitle(`R&D Solution for ${c.title.slice(0, 30)}...`);
                      setShowProposalModal(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>Form Team & Submit Proposal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active R&D Projects & Milestone Tracker (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Active University R&D Projects & Patents
            </h2>
            <span className="text-xs text-slate-400 font-medium">Tracking Milestones & CSR Funding</span>
          </div>

          <div className="space-y-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                      Team: {proj.teamName}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 uppercase">
                      Status: {proj.status}
                    </span>
                  </div>

                  {proj.patentStatus !== 'NONE' && (
                    <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> Patent: {proj.patentStatus}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{proj.description}</p>
                </div>

                {/* Team & Faculty Mentor Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Faculty Mentor:</span>
                    <strong className="text-slate-200">{proj.facultyMentorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Student Researchers:</span>
                    <strong className="text-slate-200">{proj.teamMembers.join(', ')}</strong>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">Milestone Progress ({proj.milestones.filter(m => m.status === 'COMPLETED').length}/{proj.milestones.length})</span>
                    <span className="text-cyan-400 font-mono">
                      Budget: ₹{(proj.budgetRequired / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {proj.milestones.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 text-xs border border-slate-850">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className={`w-4 h-4 ${m.status === 'COMPLETED' ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span className={m.status === 'COMPLETED' ? 'text-slate-200 line-through' : 'text-white'}>{m.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Due: {m.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PROPOSAL CREATION MODAL */}
      {showProposalModal && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
                Submit R&D Proposal
              </h3>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 font-medium">Target Problem:</span>
                <p className="font-bold text-white mt-0.5">{selectedChallenge.title}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">R&D Solution Project Title *</label>
                <input
                  type="text"
                  required
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Technical Description & Methodology *</label>
                <textarea
                  required
                  rows={3}
                  value={proposalDesc}
                  onChange={(e) => setProposalDesc(e.target.value)}
                  placeholder="Explain the engineering approach, prototype design, and field testing schedule..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Faculty Mentor</label>
                  <input
                    type="text"
                    value={facultyMentor}
                    onChange={(e) => setFacultyMentor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Budget Required (₹)</label>
                  <input
                    type="number"
                    value={budgetRequired}
                    onChange={(e) => setBudgetRequired(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Student Researchers (Comma-separated)</label>
                <input
                  type="text"
                  value={studentMembers}
                  onChange={(e) => setStudentMembers(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Submit R&D Proposal
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
