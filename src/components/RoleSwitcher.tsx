'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import {
  Users,
  GraduationCap,
  Building2,
  LayoutDashboard,
  ChevronDown,
  Check,
} from 'lucide-react';

const ROLES: {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: any;
  route: string;
  iconBg: string;
  activeBorder: string;
}[] = [
  {
    id: 'CITIZEN',
    title: 'Citizen Portal',
    subtitle: 'Report & track local problems',
    icon: Users,
    route: '/citizen/dashboard',
    iconBg: 'bg-green-700',
    activeBorder: 'border-green-400',
  },
  {
    id: 'UNIVERSITY_FACULTY',
    title: 'HEI / University',
    subtitle: 'R&D teams & proposal submission',
    icon: GraduationCap,
    route: '/hei/dashboard',
    iconBg: 'bg-blue-700',
    activeBorder: 'border-blue-400',
  },
  {
    id: 'INDUSTRY_CSR',
    title: 'Industry / CSR',
    subtitle: 'Pledge funding & co-develop',
    icon: Building2,
    route: '/industry/dashboard',
    iconBg: 'bg-purple-700',
    activeBorder: 'border-purple-400',
  },
  {
    id: 'GOVT_ADMIN',
    title: 'Govt Command Center',
    subtitle: 'District heatmaps & analytics',
    icon: LayoutDashboard,
    route: '/govt/dashboard',
    iconBg: 'bg-amber-600',
    activeBorder: 'border-amber-400',
  },
];

export default function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const activeRole = ROLES.find((r) => {
    const sectionPath = '/' + r.route.split('/')[1];
    return pathname.startsWith(r.route) || pathname.startsWith(sectionPath);
  }) || ROLES[0];
  const Icon = activeRole.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all duration-200 text-left"
      >
        <div className={`p-1.5 rounded-lg ${activeRole.iconBg} text-white shadow-sm`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="hidden md:block">
          <div className="text-xs font-bold text-slate-900 leading-none">{activeRole.title}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Switch Portal</div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-2 space-y-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Switch Portal
              </span>
            </div>

            {ROLES.map((role) => {
              const RoleIcon = role.icon;
              const sectionPath = '/' + role.route.split('/')[1];
              const isSelected = activeRole.id === role.id || pathname.startsWith(role.route) || pathname.startsWith(sectionPath);

              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(role.route);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                    isSelected
                      ? `bg-slate-50 border ${role.activeBorder} border`
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role.iconBg} text-white shadow-sm flex-shrink-0`}>
                    <RoleIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">{role.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{role.subtitle}</p>
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
