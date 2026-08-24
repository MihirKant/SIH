'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Cpu, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { AiClassificationResult } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  analysis: AiClassificationResult | null;
  challengeTitle: string;
}

export default function AiProcessingModal({ isOpen, onClose, analysis, challengeTitle }: Props) {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timer1 = setTimeout(() => setStep(1), 600);
      const timer2 = setTimeout(() => setStep(2), 1400);
      const timer3 = setTimeout(() => setStep(3), 2200);
      const timer4 = setTimeout(() => setStep(4), 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isOpen]);

  if (!isOpen || !analysis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl shadow-cyan-500/10 overflow-hidden relative">
        
        {/* Glow Header Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Gemini AI Intelligence Engine
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-md font-mono">LIVE MATCHING</span>
              </h3>
              <p className="text-xs text-slate-400">Processing: "{challengeTitle}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-semibold px-3 py-1 bg-slate-800 rounded-lg"
          >
            Close Preview
          </button>
        </div>

        {/* Step-by-Step AI Execution Trace */}
        <div className="space-y-4 mb-6 font-mono text-xs">
          
          {/* Step 1 */}
          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
            step >= 1 ? 'bg-slate-850 border-slate-700/80 text-slate-200' : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-400 flex items-center gap-2">
                {step >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600 animate-spin" />}
                [Step 1] NLP Intent & Category Extraction
              </span>
              {step >= 1 && <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">{analysis.category}</span>}
            </div>
            {step >= 1 && (
              <p className="mt-1.5 text-slate-300 text-[11px] font-sans">
                Tagged Domain: <span className="font-semibold text-white">{analysis.subCategory}</span>. Recognized high community intent.
              </p>
            )}
          </div>

          {/* Step 2 */}
          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
            step >= 2 ? 'bg-slate-850 border-slate-700/80 text-slate-200' : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-400 flex items-center gap-2">
                {step >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                [Step 2] Vector Deduplication & Cluster Scan
              </span>
              {step >= 2 && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${analysis.duplicateMatchFound ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {analysis.duplicateMatchFound ? 'DUPLICATE CLUSTERED' : 'UNIQUE REPORT'}
                </span>
              )}
            </div>
            {step >= 2 && (
              <p className="mt-1.5 text-slate-300 text-[11px] font-sans">
                {analysis.duplicateMatchFound 
                  ? `Identified matching report in cluster #${analysis.duplicateChallengeId}. Incrementing impact weight.`
                  : `No duplicates found in district radius. Created new primary ticket.`}
              </p>
            )}
          </div>

          {/* Step 3 */}
          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
            step >= 3 ? 'bg-slate-850 border-slate-700/80 text-slate-200' : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-400 flex items-center gap-2">
                {step >= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                [Step 3] Urgency & Social Impact Matrix
              </span>
              {step >= 3 && (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold">Urgency: {analysis.urgencyScore}/100</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold">Impact: {analysis.impactScore}/100</span>
                </div>
              )}
            </div>
            {step >= 3 && (
              <p className="mt-1.5 text-slate-300 text-[11px] font-sans">
                {analysis.reasoning}
              </p>
            )}
          </div>

          {/* Step 4 */}
          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
            step >= 4 ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-cyan-500/40 text-slate-200' : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-400 flex items-center gap-2">
                {step >= 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
                [Step 4] HEI Department Matchmaking & Smart Routing
              </span>
              {step >= 4 && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> ROUTED
                </span>
              )}
            </div>
            {step >= 4 && (
              <div className="mt-2 text-slate-200 font-sans space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Assigned Institution: {analysis.matchedUniversityName || 'BIT Mesra'}
                </p>
                <p className="text-[11px] text-slate-300">
                  Target Departments: <span className="text-white font-medium">{analysis.recommendedDepartments.join(', ')}</span>
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Action button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Reasoning Complete</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <span>Proceed to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
