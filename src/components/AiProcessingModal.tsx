'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Cpu, ShieldCheck, ArrowRight, Zap, X } from 'lucide-react';
import { AiClassificationResult } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  analysis: AiClassificationResult | null;
  challengeTitle?: string;
}

export default function AiProcessingModal({ isOpen, onClose, analysis, challengeTitle }: Props) {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timer1 = setTimeout(() => setStep(1), 500);
      const timer2 = setTimeout(() => setStep(2), 1200);
      const timer3 = setTimeout(() => setStep(3), 1900);
      const timer4 = setTimeout(() => setStep(4), 2600);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center text-green-700">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                AI Intelligence Engine
                <span className="px-2 py-0.5 text-[10px] bg-green-100 text-green-800 rounded-md font-mono font-bold">
                  {analysis.reasoning?.includes('Groq') ? 'Groq Llama-3' : analysis.reasoning?.includes('Gemini') ? 'Gemini Flash' : 'Llama 3 / Zero-Token Vector'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-md">Processing: "{challengeTitle || 'Submitted Challenge'}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step AI Execution Trace */}
        <div className="space-y-3 mb-6 text-xs">
          {/* Step 1 */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            step >= 1 ? 'bg-green-50/60 border-green-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-green-800 flex items-center gap-2">
                {step >= 1 ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border border-slate-400 animate-spin" />}
                [Step 1] NLP Intent & Category Extraction
              </span>
              {step >= 1 && <span className="text-[10px] text-green-800 bg-green-200/80 px-2 py-0.5 rounded font-bold">{analysis.category}</span>}
            </div>
            {step >= 1 && (
              <p className="mt-1.5 text-slate-600 text-[11px]">
                Tagged Domain: <span className="font-semibold text-slate-900">{analysis.subCategory}</span>. Recognized high community intent.
              </p>
            )}
          </div>

          {/* Step 2 */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            step >= 2 ? 'bg-blue-50/60 border-blue-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-800 flex items-center gap-2">
                {step >= 2 ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <div className="w-4 h-4 rounded-full border border-slate-400" />}
                [Step 2] Vector Deduplication & Cluster Scan
              </span>
              {step >= 2 && (
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${analysis.duplicateMatchFound ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                  {analysis.duplicateMatchFound ? 'DUPLICATE CLUSTERED' : 'UNIQUE REPORT'}
                </span>
              )}
            </div>
            {step >= 2 && (
              <p className="mt-1.5 text-slate-600 text-[11px]">
                {analysis.duplicateMatchFound
                  ? `Identified matching report in cluster #${analysis.duplicateChallengeId}. Incrementing impact weight.`
                  : `No duplicates found in district radius. Created new primary ticket.`}
              </p>
            )}
          </div>

          {/* Step 3 */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            step >= 3 ? 'bg-amber-50/60 border-amber-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-800 flex items-center gap-2">
                {step >= 3 ? <CheckCircle2 className="w-4 h-4 text-amber-600" /> : <div className="w-4 h-4 rounded-full border border-slate-400" />}
                [Step 3] Urgency & Social Impact Matrix
              </span>
              {step >= 3 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Urgency: {analysis.urgencyScore}/100</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">Impact: {analysis.impactScore}/100</span>
                </div>
              )}
            </div>
            {step >= 3 && (
              <p className="mt-1.5 text-slate-600 text-[11px]">
                {analysis.reasoning}
              </p>
            )}
          </div>

          {/* Step 4 */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            step >= 4 ? 'bg-purple-50/60 border-purple-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-800 flex items-center gap-2">
                {step >= 4 ? <CheckCircle2 className="w-4 h-4 text-purple-600" /> : <div className="w-4 h-4 rounded-full border border-slate-400" />}
                [Step 4] HEI Department Matchmaking & Smart Routing
              </span>
              {step >= 4 && (
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-600" /> ROUTED
                </span>
              )}
            </div>
            {step >= 4 && (
              <div className="mt-2 text-slate-700 space-y-1 bg-white p-2.5 rounded-lg border border-purple-100">
                <p className="text-xs font-bold text-green-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Assigned Institution: {analysis.matchedUniversityName || 'BIT Mesra'}
                </p>
                <p className="text-[11px] text-slate-600">
                  Target Departments: <span className="text-slate-900 font-semibold">{analysis.recommendedDepartments.join(', ')}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Reasoning Complete</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Proceed to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
