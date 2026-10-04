import React from 'react';
import { SimulationResult } from '../../types/index.js';
import { Bookmark, Droplets, Thermometer, Sprout, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface BaselineDecisionCardProps {
  baseline: SimulationResult;
}

export const BaselineDecisionCard: React.FC<BaselineDecisionCardProps> = ({ baseline }) => {
  const { getCropName } = useLanguage();

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden border border-slate-800" id="baseline-decision-card">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">Baseline Scenario Snapshot</span>
            <h3 className="text-xl font-black text-white">
              Baseline Decision: {getCropName(baseline.crop)}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 w-fit">
          <span>Recorded: {new Date(baseline.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>•</span>
          <span>{baseline.input.farmArea} Acres</span>
        </div>
      </div>

      {/* Input Parameters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5">
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-slate-400 block text-[11px] mb-0.5 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Rainfall
          </span>
          <span className="font-bold text-slate-100 text-sm">{baseline.input.rainfall} mm</span>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-slate-400 block text-[11px] mb-0.5 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature
          </span>
          <span className="font-bold text-slate-100 text-sm">{baseline.input.temperature}°C</span>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-slate-400 block text-[11px] mb-0.5 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Supply
          </span>
          <span className="font-bold text-slate-100 text-sm">{baseline.input.waterAvailability}</span>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-slate-400 block text-[11px] mb-0.5 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" /> Fertilizer
          </span>
          <span className="font-bold text-slate-100 text-sm">{baseline.input.fertilizerUsage}</span>
        </div>
      </div>

      {/* Baseline Outputs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Expected Yield</span>
          <span className="text-base sm:text-lg font-black text-white">
            {baseline.predictedYieldPerAcre.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">kg/ac</span>
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Expected Revenue</span>
          <span className="text-base sm:text-lg font-black text-emerald-400">
            ₹{baseline.estimatedRevenue.toLocaleString('en-IN')}
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Expected Profit</span>
          <span className="text-base sm:text-lg font-black text-emerald-300">
            ₹{baseline.expectedProfit.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">ROI: {baseline.roiPercentage}%</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 uppercase font-semibold block">Risk Profile</span>
          <span className="text-base sm:text-lg font-black text-amber-300">
            {baseline.riskScore} <span className="text-xs font-normal text-slate-400">/ 100 ({baseline.riskLevel})</span>
          </span>
        </div>
      </div>
    </div>
  );
};
