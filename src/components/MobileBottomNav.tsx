'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  PlusCircle,
  GraduationCap,
  LayoutDashboard,
} from 'lucide-react';

const navItems = [
  { label: 'Home',       labelHi: 'होम',       href: '/',          icon: Home },
  { label: 'Citizen',    labelHi: 'नागरिक',    href: '/citizen',   icon: Users },
  { label: 'Report',     labelHi: 'दर्ज करें', href: '/citizen/report', icon: PlusCircle, isAction: true },
  { label: 'University', labelHi: 'विवि',      href: '/hei',       icon: GraduationCap },
  { label: 'Govt',       labelHi: 'सरकार',     href: '/govt',      icon: LayoutDashboard },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-safe">
      <div className="mx-3 mb-2 rounded-2xl bg-white border border-slate-200 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const sectionPath = item.href === '/' ? '/' : '/' + item.href.split('/')[1];
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href) || pathname.startsWith(sectionPath);

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-13 h-13 rounded-full bg-green-700 p-[3px] shadow-xl shadow-green-700/30 group-hover:scale-105 active:scale-95 transition-transform flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <PlusCircle className="w-6 h-6 text-green-700" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-green-700 mt-1 hindi">{item.labelHi}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-green-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-green-700' : ''}`} />
              <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
