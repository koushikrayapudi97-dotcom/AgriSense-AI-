import React from 'react';
import { AdaptiveResimulateResult } from '../../types/index.js';
import { ArrowRight, CheckCircle2, AlertTriangle, ArrowRightLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface VisualFlowCardProps {
  data: AdaptiveResimulateResult;
}

export const VisualFlowCard: React.FC<VisualFlowCardProps> = ({ data }) => {
  const { getCropName } = useLanguage();

  const baseline = data.baseline;
  const updated = data.updated;
  const bestAlt = data.alternatives[0];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md space-y-4" id="visual-planning-flow">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
              Adaptive Re-Planning Flowchart
            </h3>
            <p className="text-[11px] text-slate-400">
              End-to-end dynamic decision reassessment loop
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Live Decision Loop
        </span>
      </div>

      {/* 4 Steps Horizontal Chain */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        {/* Step 1: Before */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2 relative">
          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block">
            1. Baseline Strategy
          </span>
          <div className="text-base font-black text-white">
            {baseline.crop}
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Expected Profit:</span>
              <strong className="text-emerald-400">₹{baseline.expectedProfit.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between">
              <span>Risk Score:</span>
              <strong className="text-slate-200">{baseline.riskScore}/100</strong>
            </div>
          </div>
        </div>

        {/* Step 2: Conditions Changed */}
        <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30 space-y-2">
          <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 block">
            2. Conditions Shifted
          </span>
          <div className="text-sm font-black text-amber-200">
            {data.changedFactors.length > 0 ? data.changedFactors[0] : 'Parameters Updated'}
          </div>
          <div className="text-[11px] text-slate-300 space-y-0.5">
            {data.changedFactors.slice(1, 3).map((f, i) => (
              <div key={i} className="truncate">• {f}</div>
            ))}
          </div>
        </div>

        {/* Step 3: New Analysis */}
        <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/30 space-y-2">
          <span className="text-[10px] uppercase font-black tracking-wider text-rose-400 block">
            3. Original Under Stress
          </span>
          <div className="text-base font-black text-rose-300">
            {updated.crop} (Stressed)
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Updated Profit:</span>
              <strong className="text-rose-400">₹{updated.expectedProfit.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between">
              <span>Risk Score:</span>
              <strong className="text-rose-300">{updated.riskScore}/100</strong>
            </div>
          </div>
        </div>

        {/* Step 4: Recommended Strategy */}
        <div className="bg-emerald-950/50 p-4 rounded-2xl border border-emerald-500/40 space-y-2 ring-1 ring-emerald-500/50">
          <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 block">
            4. Recommended Action
          </span>
          <div className="text-base font-black text-emerald-300">
            {data.recommendation.recommendedCrop}
          </div>
          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span>Recommended Profit:</span>
              <strong className="text-emerald-400">
                ₹{(bestAlt?.profit || data.recommendation.decisionImpactComparison.updatedStrategy.profit).toLocaleString('en-IN')}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <strong className="text-emerald-300">{data.strategy_status}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
