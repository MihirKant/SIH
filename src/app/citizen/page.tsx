'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  PlusCircle, 
  Search, 
  Filter, 
  MapPin, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Sparkles, 
  GraduationCap,
  Building2,
  AlertCircle
} from 'lucide-react';
import { ChallengeItem, ProblemCategory } from '@/types';
import { INITIAL_CHALLENGES } from '@/lib/mockData';

const CATEGORIES: (ProblemCategory | 'ALL')[] = [
  'ALL',
  'Water Resources',
  'Sustainable Agriculture',
  'Rural Healthcare',
  'Urban & Rural Infrastructure',
  'Clean Energy & Power',
  'Waste Management & Sanitation',
  'E-Governance & Public Service'
];

const DISTRICTS = ['ALL', 'Ranchi', 'East Singhbhum', 'Dhanbad', 'Hazaribagh', 'Latehar', 'Khunti', 'Simdega'];

export default function CitizenPortalPage() {
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, [selectedCategory, selectedDistrict]);

  async function fetchChallenges() {
    setLoading(true);
    try {
      const res = await fetch(`/api/challenges?category=${selectedCategory}&district=${selectedDistrict}`);
      const json = await res.json();
      if (json.success && json.data) {
        setChallenges(json.data);
      } else {
        setChallenges(INITIAL_CHALLENGES);
      }
    } catch (err) {
      setChallenges(INITIAL_CHALLENGES);
    } finally {
      setLoading(false);
    }
  }

  const filteredChallenges = challenges.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-emerald-500/30 shadow-2xl mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Citizen Grassroots Empowerment Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white">Crowdsourced Societal Challenges</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Report local community issues in your district. Our AI system deduplicates reports, assigns priority scores, and routes them directly to University R&D labs.
          </p>
        </div>

        <Link
          href="/citizen/report"
          className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform flex items-center space-x-2 self-start md:self-auto"
        >
          <PlusCircle className="w-5 h-5 text-slate-950" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems, keywords, or villages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category & District Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              {DISTRICTS.map(dist => (
                <option key={dist} value={dist} className="bg-slate-900 text-slate-200">{dist}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Challenges Feed */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-sm flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          <span>Fetching crowdsourced challenges...</span>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No challenges match your query</h3>
          <p className="text-xs text-slate-400 mt-1">Try selecting a different district or clear search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image & Status Tag */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-extrabold uppercase ${
                      item.status === 'IN_PROGRESS'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : item.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : item.status === 'CLUSTERED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.locationName}, <strong className="text-slate-200">{item.district}</strong></span>
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Assigned HEI Badge */}
                  {item.assignedUniversityName && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-2.5 text-xs text-slate-300">
                      <GraduationCap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">Routed to: <strong className="text-white">{item.assignedUniversityName}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Metrics */}
              <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/20">
                    Urgency: {item.urgencyScore}/100
                  </span>
                  <span className="flex items-center space-x-1 text-slate-400">
                    <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.upvotesCount} upvotes</span>
                  </span>
                </div>

                <Link
                  href={`/citizen/track/${item.id}`}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
                >
                  <span>Track Status</span>
                  <span>→</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
