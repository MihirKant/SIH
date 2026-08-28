'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  GraduationCap,
  Building2,
  LayoutDashboard,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  Globe,
  Type,
  UserCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import JanSamadhanLogo from './JanSamadhanLogo';
import GoogleTranslate from './GoogleTranslate';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

const NAV_LINKS = [
  { label: 'Citizen Portal',  labelHi: 'नागरिक पोर्टल', href: '/citizen',  role: 'CITIZEN' as UserRole, icon: Users,          color: 'text-green-700',  activeBg: 'bg-green-700 text-white' },
  { label: 'HEI / University',labelHi: 'विश्वविद्यालय', href: '/hei',      role: 'UNIVERSITY_FACULTY' as UserRole, icon: GraduationCap,  color: 'text-blue-700',   activeBg: 'bg-blue-700 text-white'  },
  { label: 'Industry & CSR',  labelHi: 'उद्योग & CSR',  href: '/industry', role: 'INDUSTRY_CSR' as UserRole, icon: Building2,      color: 'text-purple-700', activeBg: 'bg-purple-700 text-white' },
  { label: 'Govt Analytics',  labelHi: 'सरकारी विश्लेषण',href: '/govt',     role: 'GOVT_ADMIN' as UserRole, icon: LayoutDashboard,color: 'text-amber-700',  activeBg: 'bg-amber-700 text-white'  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openAuthModal, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const increaseFontSize = () => setFontSize((f) => Math.min(f + 2, 20));
  const decreaseFontSize = () => setFontSize((f) => Math.max(f - 2, 14));

  if (typeof document !== 'undefined') {
    document.documentElement.style.fontSize = fontSize + 'px';
  }

  const roleLabelMap: Record<UserRole, { label: string; badgeClass: string; route: string }> = {
    CITIZEN: { label: 'Citizen', badgeClass: 'bg-green-100 text-green-800 border-green-300', route: '/citizen/dashboard' },
    UNIVERSITY_FACULTY: { label: 'University', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300', route: '/hei/dashboard' },
    UNIVERSITY_STUDENT: { label: 'Student', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300', route: '/hei/dashboard' },
    INDUSTRY_CSR: { label: 'Industry / CSR', badgeClass: 'bg-purple-100 text-purple-800 border-purple-300', route: '/industry/dashboard' },
    GOVT_ADMIN: { label: 'Govt Admin', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300', route: '/govt/dashboard' },
  };

  return (
    <>
      {/* Indian Flag Tricolor Bar */}
      <div className="tricolor-bar w-full" />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Left: Logo ────────────────────────────────────────────────── */}
            <Link href="/" className="flex-shrink-0">
              <JanSamadhanLogo size="md" variant="light" />
            </Link>

            {/* ── Center: Nav Tabs (desktop) ────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? link.activeBg + ' shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right: Accessibility + Auth Controls ────────────────────── */}
            <div className="hidden lg:flex items-center gap-2">

              {/* Accessibility: Font size */}
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2 py-1.5">
                <button
                  onClick={decreaseFontSize}
                  title="Decrease font size"
                  className="text-xs font-bold text-slate-600 hover:text-green-700 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-green-50 transition-colors"
                >
                  A<span className="text-[8px]">▼</span>
                </button>
                <Type className="w-3.5 h-3.5 text-slate-400 mx-1" />
                <button
                  onClick={increaseFontSize}
                  title="Increase font size"
                  className="text-sm font-bold text-slate-600 hover:text-green-700 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-green-50 transition-colors"
                >
                  A<span className="text-[8px]">▲</span>
                </button>
              </div>

              {/* Language Selector */}
              <GoogleTranslate />

              {/* Logged In User vs Login Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-green-700 text-white font-black flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <span className="block font-bold text-slate-900 leading-tight max-w-[120px] truncate">
                        {user.name}
                      </span>
                      <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded border font-semibold ${roleLabelMap[user.role]?.badgeClass || 'bg-slate-200 text-slate-700'}`}>
                        {roleLabelMap[user.role]?.label || user.role}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-3">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <div className="text-xs font-extrabold text-slate-900">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                          {user.organization && (
                            <div className="text-[11px] text-green-800 font-medium pt-1 border-t border-slate-200/60 mt-1">
                              {user.organization} ({user.district || 'Jharkhand'})
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              router.push(roleLabelMap[user.role]?.route || '/citizen');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                          >
                            <span>Go to Portal Dashboard</span>
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                          </button>

                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              openAuthModal('CITIZEN', 'login');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              Switch Account / Role
                            </span>
                          </button>
                        </div>

                        <div className="border-t border-slate-100 pt-2">
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Login / Register Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setLoginOpen(!loginOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login / Register</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${loginOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {loginOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setLoginOpen(false)} />
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                          Select Portal Role Login
                        </p>
                        {[
                          { role: 'CITIZEN' as UserRole, label: 'Citizen Login', sub: 'Report & track problems', icon: Users, color: 'text-green-700 bg-green-50' },
                          { role: 'UNIVERSITY_FACULTY' as UserRole, label: 'University Login', sub: 'HEI faculty & researchers', icon: GraduationCap, color: 'text-blue-700 bg-blue-50' },
                          { role: 'INDUSTRY_CSR' as UserRole, label: 'Industry / CSR', sub: 'Fund & co-develop solutions', icon: Building2, color: 'text-purple-700 bg-purple-50' },
                          { role: 'GOVT_ADMIN' as UserRole, label: 'Government Login', sub: 'Admin & analytics', icon: LayoutDashboard, color: 'text-amber-700 bg-amber-50' },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.role}
                              onClick={() => {
                                setLoginOpen(false);
                                openAuthModal(item.role, 'login');
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                            >
                              <div className={`p-2 rounded-lg ${item.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                                <p className="text-xs text-slate-500">{item.sub}</p>
                              </div>
                            </button>
                          );
                        })}
                        <div className="border-t border-slate-100 pt-2 mt-1">
                          <button
                            onClick={() => {
                              setLoginOpen(false);
                              openAuthModal('CITIZEN', 'register');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors justify-center"
                          >
                            <UserPlus className="w-4 h-4" />
                            New User? Register Free
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Mobile: Hamburger ─────────────────────────────────────────── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ─────────────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const sectionPath = '/' + link.href.split('/')[1];
              const isActive = pathname.startsWith(link.href) || pathname.startsWith(sectionPath);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? link.activeBg + ' shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <span className="block">{link.label}</span>
                    <span className="block text-xs hindi opacity-70">{link.labelHi}</span>
                  </div>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-slate-500">Language:</span>
                <GoogleTranslate />
              </div>
              {user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out ({user.name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openAuthModal('CITIZEN', 'login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login / Register (All Roles)
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

