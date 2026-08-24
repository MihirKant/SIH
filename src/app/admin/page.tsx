'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  TrendingUp, 
  Award, 
  FileText, 
  Download, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Users,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

import { DISTRICT_STATS } from '@/lib/mockData';

const COLORS = ['#0ea5e9', '#10b981', '#6366f1', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function GovernmentAdminPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  const handleExportReport = () => {
    const reportText = `
JAN SAMADHAN AI - GOVERNMENT EXECUTIVE BRIEF (JHARKHAND)
Date: ${new Date().toLocaleDateString()}
-------------------------------------------------------
Total Societal Challenges Crowdsourced: 224
Active University R&D Projects: 46
Total CSR Funding Disbursed: ₹ 1.42 Crores
Patents Applied: 12
Participating HEIs: 14 Institutions

District Breakdown:
- Ranchi: 42 submitted, 8 active projects, ₹ 24.5 Lakhs CSR
- East Singhbhum: 38 submitted, 7 active projects, ₹ 18.0 Lakhs CSR
- Dhanbad: 51 submitted, 9 active projects, ₹ 32.0 Lakhs CSR
- Hazaribagh: 29 submitted, 4 active projects, ₹ 12.5 Lakhs CSR
- Latehar: 24 submitted, 5 active projects, ₹ 15.0 Lakhs CSR
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JanSamadhan_Govt_Executive_Brief_${Date.now()}.txt`;
    a.click();
  };

  const domainData = [
    { name: 'Water Resources', value: 28 },
    { name: 'Sustainable Agri', value: 22 },
    { name: 'Waste & Sanitation', value: 19 },
    { name: 'Rural Healthcare', value: 15 },
    { name: 'Clean Energy', value: 10 },
    { name: 'Education Tech', value: 6 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/60 border border-amber-500/30 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>State Policy & Command Analytics Center</span>
          </div>
          <h1 className="text-3xl font-black text-white">Government Executive Dashboard</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Monitor real-time district heatmaps, track HEI participation metrics, oversee corporate CSR allocations, and generate policy impact briefs.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform flex items-center space-x-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-slate-950" />
          <span>Export Executive Brief (.TXT / PDF)</span>
        </button>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Challenges Crowdsourced</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">224</div>
          <span className="text-[10px] text-emerald-400 font-bold">24 Districts Covered</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active HEI R&D Projects</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">46</div>
          <span className="text-[10px] text-emerald-300 font-bold">BIT, NIT & IIT Labs</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total CSR Grants Deployed</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400">₹ 1.42 Cr</div>
          <span className="text-[10px] text-indigo-300 font-bold">Tata, CIL & NTPC Funds</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Patents & IP Applied</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">12</div>
          <span className="text-[10px] text-amber-300 font-bold">NEP 2020 IP Growth</span>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Domain Distribution Pie */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              Societal Challenge Domain Distribution
            </h3>
            <span className="text-xs text-slate-400">Percentage %</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: District Activity Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              District Submissions vs Active R&D Projects
            </h3>
            <span className="text-xs text-slate-400">Count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_STATS.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="district" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="submitted" name="Submitted Challenges" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="activeProjects" name="Active Projects" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* District Analytics Heatmap Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            District-wise Performance & CSR Heatmap (Jharkhand)
          </h2>
          <span className="text-xs text-slate-400">Updated Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">District</th>
                <th className="p-3">Submitted Challenges</th>
                <th className="p-3">Active HEI Projects</th>
                <th className="p-3">Resolved Issues</th>
                <th className="p-3">CSR Funding Deployed</th>
                <th className="p-3">Impact Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {DISTRICT_STATS.map((d) => (
                <tr key={d.district} className="hover:bg-slate-850/50">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {d.district}
                  </td>
                  <td className="p-3 font-bold text-cyan-300">{d.submitted}</td>
                  <td className="p-3 font-bold text-emerald-400">{d.activeProjects}</td>
                  <td className="p-3 font-bold text-slate-200">{d.resolved}</td>
                  <td className="p-3 font-mono font-bold text-indigo-300">{d.csrFunded}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      HIGH IMPACT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
