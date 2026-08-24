'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  ShieldAlert, 
  ChevronDown,
  Sparkles,
  Check
} from 'lucide-react';

const ROLES: { id: UserRole; title: string; subtitle: string; icon: any; route: string; color: string }[] = [
  {
    id: 'CITIZEN',
    title: 'Citizen Persona',
    subtitle: 'Report societal problems, track status & voice upload',
    icon: Users,
    route: '/citizen',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'UNIVERSITY_FACULTY',
    title: 'HEI / University',
    subtitle: 'Review routed problems, build R&D teams & submit proposals',
    icon: GraduationCap,
    route: '/university',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'INDUSTRY_CSR',
    title: 'Industry / CSR Sponsor',
    subtitle: 'Pledge funding, co-develop prototypes & sponsor pilots',
    icon: Building2,
    route: '/industry',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'GOVT_ADMIN',
    title: 'Government Command Center',
    subtitle: 'District heatmaps, sector metrics & policy analytics',
    icon: ShieldAlert,
    route: '/admin',
    color: 'from-amber-500 to-orange-600',
  },
];

export default function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const activeRole = ROLES.find(r => pathname.startsWith(r.route)) || ROLES[0];
  const Icon = activeRole.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700/80 transition-all duration-200 shadow-lg text-left"
      >
        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${activeRole.color} text-white shadow-md`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="hidden md:block">
          <div className="text-xs font-bold text-white leading-none">{activeRole.title}</div>
          <div className="text-[10px] text-slate-400 font-medium">Switch Role</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl">
            <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">SIH Persona Switcher</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {ROLES.map((role) => {
              const RoleIcon = role.icon;
              const isSelected = activeRole.id === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(role.route);
                  }}
                  className={`w-full flex items-start space-x-3 p-2.5 rounded-xl transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-slate-800/90 border border-slate-700/80 text-white'
                      : 'hover:bg-slate-800/40 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${role.color} text-white shadow-sm mt-0.5`}>
                    <RoleIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{role.title}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{role.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
