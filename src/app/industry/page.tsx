'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_GRANTS } from '@/lib/mockData';
import { GrantItem, ProjectItem } from '@/types';

export default function IndustryCsrPortalPage() {
  const [grants, setGrants] = useState<GrantItem[]>(INITIAL_GRANTS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const [sponsorName, setSponsorName] = useState('Tata Steel Foundation (CSR)');
  const [pledgeAmount, setPledgeAmount] = useState('200000');
  const [csrCategory, setCsrCategory] = useState('Clean Water & Sanitation');

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const amount = parseFloat(pledgeAmount) || 200000;
    const newGrant: GrantItem = {
      id: `g-${Date.now().toString().slice(-4)}`,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      sponsorName,
      amountPledged: amount,
      status: 'COMMITTED',
      csrCategory,
      createdAt: new Date().toISOString(),
    };

    setGrants([newGrant, ...grants]);
    
    // Update project funded amount
    setProjects(projects.map(p => {
      if (p.id === selectedProject.id) {
        return { ...p, budgetFunded: p.budgetFunded + amount };
      }
      return p;
    }));

    setShowPledgeModal(false);
  };

  const totalCsrDisbursed = grants.reduce((sum, g) => sum + g.amountPledged, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Industry CSR Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/30 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" />
            <span>Industry & CSR Co-Innovation Hub</span>
          </div>
          <h1 className="text-3xl font-black text-white">CSR Project Marketplace</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Sponsor validated university R&D prototypes, fulfill corporate CSR obligations under Schedule VII, and accelerate field pilots across Jharkhand districts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 text-right self-start md:self-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Total CSR Funds Pledged</span>
          <span className="text-2xl font-black text-indigo-400">₹ {(totalCsrDisbursed / 100000).toFixed(2)} Lakhs</span>
        </div>
      </div>

      {/* CSR Projects Marketplace */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Validated University R&D Projects Seeking CSR Grants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const fundingPercent = Math.min(100, Math.round((proj.budgetFunded / proj.budgetRequired) * 100));

            return (
              <div
                key={proj.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                      {proj.universityName}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{fundingPercent}% Funded</span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">{proj.title}</h3>
                  
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{proj.description}</p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Target Budget:</span>
                      <strong className="text-white">₹ {(proj.budgetRequired / 100000).toFixed(1)} Lakhs</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Pledged so far:</span>
                      <strong className="text-emerald-400">₹ {(proj.budgetFunded / 100000).toFixed(1)} Lakhs</strong>
                    </div>
                  </div>

                  {/* Funding Bar */}
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${fundingPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedProject(proj);
                    setShowPledgeModal(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Pledge CSR Grant Funding</span>
                </button>

              </div>
            );
          })}
        </div>
      </div>

      {/* Recent CSR Grants History Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          Recent Corporate CSR Disbursements & Commitments
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Sponsor Organization</th>
                <th className="p-3">Project Title</th>
                <th className="p-3">CSR Category</th>
                <th className="p-3">Amount Pledged</th>
                <th className="p-3">Disbursement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {grants.map((g) => (
                <tr key={g.id} className="hover:bg-slate-850/50">
                  <td className="p-3 font-bold text-white">{g.sponsorName}</td>
                  <td className="p-3 font-medium text-slate-200">{g.projectTitle}</td>
                  <td className="p-3 text-cyan-300">{g.csrCategory}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">₹ {g.amountPledged.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
                      {g.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLEDGE CSR MODAL */}
      {showPledgeModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Pledge CSR Grant Funding
              </h3>
              <button
                onClick={() => setShowPledgeModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handlePledge} className="space-y-4 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-medium">Selected R&D Project:</span>
                <p className="font-bold text-white">{selectedProject.title}</p>
                <p className="text-[11px] text-cyan-400">University: {selectedProject.universityName}</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Sponsor Organization Name *</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Pledge Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={pledgeAmount}
                  onChange={(e) => setPledgeAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">CSR Category / Schedule VII Alignment</label>
                <input
                  type="text"
                  value={csrCategory}
                  onChange={(e) => setCsrCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20"
                >
                  Confirm CSR Grant Commitment
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
