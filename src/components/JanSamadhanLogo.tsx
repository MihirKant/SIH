'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export default function JanSamadhanLogo({ size = 'md', variant = 'light' }: LogoProps) {
  const dims = {
    sm: { icon: 36, svg: 20, title: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 44, svg: 26, title: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 56, svg: 34, title: 'text-3xl', sub: 'text-sm' },
  }[size];

  const isDark = variant === 'dark';
  const titleColor = isDark ? 'text-white' : 'text-[#166534]';
  const subColor   = isDark ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Official Emblem: Ashoka-wheel-inspired civic bridge */}
      <div
        style={{ width: dims.icon, height: dims.icon }}
        className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300"
      >
        {/* Saffron-White-Green tricolor background */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>
        {/* Civic emblem SVG overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width={dims.svg}
            height={dims.svg}
            viewBox="0 0 32 32"
            fill="none"
          >
            {/* Bridge arch — represents citizen ↔ institution connection */}
            <path
              d="M4 22 Q16 8 28 22"
              stroke="#1e3a5f"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Three pillars: citizen, university, industry */}
            <line x1="8"  y1="22" x2="8"  y2="28" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="14" x2="16" y2="28" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="24" y1="22" x2="24" y2="28" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round"/>
            {/* Ground line */}
            <line x1="3" y1="28" x2="29" y2="28" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Rising sun at top: innovation */}
            <circle cx="16" cy="7" r="2.5" fill="#FF9933"/>
            <line x1="16" y1="2" x2="16" y2="4" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="20.5" y1="3.5" x2="19.3" y2="5" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="11.5" y1="3.5" x2="12.7" y2="5" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-2">
          <span className={`font-black tracking-tight ${dims.title} ${titleColor}`}>
            JanSamadhan
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`hindi font-semibold ${isDark ? 'text-amber-300' : 'text-amber-600'} ${dims.sub}`}>
            जन समाधान
          </span>
          <span className={`${dims.sub} ${subColor} hidden sm:inline`}>
            · Jharkhand Innovation Portal
          </span>
        </div>
      </div>
    </div>
  );
}
