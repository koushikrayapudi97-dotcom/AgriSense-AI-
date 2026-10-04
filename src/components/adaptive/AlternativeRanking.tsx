import React from 'react';
import { AlternativeStrategyItem, CropName } from '../../types/index.js';
import { Trophy, Check, ArrowRight, ShieldCheck, Droplets, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface AlternativeRankingProps {
  alternatives: AlternativeStrategyItem[];
  currentCrop: CropName;
  onApplyCrop: (crop: CropName) => void;
}

export const AlternativeRanking: React.FC<AlternativeRankingProps> = ({
  alternatives,
  currentCrop,
  onApplyCrop,
}) => {
  const { getCropName } = useLanguage();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5" id="alternative-strategy-ranking">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Automatic Alternative Strategy Ranking
            </h3>
            <p className="text-xs text-slate-500">
              Live multi-crop simulation ranking under your exact updated environmental and economic parameters.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 w-fit">
          {alternatives.length} Crops Simulated
        </span>
      </div>

      {/* Alternatives Cards / Table */}
      <div className="space-y-3">
        {alternatives.map((alt, idx) => {
          const isTopRanked = idx === 0;
          const isSelectedCrop = alt.isCurrentCrop;

          return (
            <div
              key={alt.crop}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isTopRanked
                  ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/50 shadow-xs'
                  : isSelectedCrop
                  ? 'bg-slate-50/80 border-slate-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Rank & Crop Info */}
                <div className="flex items-start sm:items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isTopRanked 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{alt.rank}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-black text-slate-900">
                        {alt.crop} <span className="text-xs font-semibold text-slate-500">({getCropName(alt.crop)})</span>
                      </h4>
                      {isTopRanked && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Best Strategy
                        </span>
                      )}
                      {isSelectedCrop && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {alt.suitabilityReason}
                    </p>
                  </div>
                </div>

                {/* Center: Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Profit</span>
                    <span className="font-black text-emerald-700 text-sm block">
                      ₹{alt.profit.toLocaleString('en-IN')}
                    </span>
                    {alt.profitAdvantageVsCurrent !== 0 && (
                      <span className={`text-[10px] font-bold ${alt.profitAdvantageVsCurrent > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {alt.profitAdvantageVsCurrent > 0 ? `+₹${alt.profitAdvantageVsCurrent.toLocaleString('en-IN')}` : `₹${alt.profitAdvantageVsCurrent.toLocaleString('en-IN')}`}
                      </span>
                    )}
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Score</span>
                    <span className={`font-black text-sm block ${alt.riskScore > 60 ? 'text-rose-600' : alt.riskScore > 40 ? 'text-amber-600' : 'text-emerald-700'}`}>
                      {alt.riskScore} <span className="text-[10px] font-normal text-slate-400">/100</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{alt.riskLevel}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Suitability</span>
                    <span className={`font-black text-xs block ${
                      alt.suitability === 'High' ? 'text-emerald-700' : alt.suitability === 'Medium' ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {alt.suitability} Fit
                    </span>
                    <span className="text-[10px] text-slate-500">{alt.waterDemandMatch}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Strategy Score</span>
                    <span className="font-black text-slate-900 text-sm block">
                      {alt.strategyScore} <span className="text-[10px] font-normal text-slate-400">/100</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Holistic Index</span>
                  </div>
                </div>

                {/* Right: Action Button */}
                <div className="shrink-0 flex items-center justify-end">
                  {isSelectedCrop ? (
                    <span className="text-xs font-bold text-slate-500 px-3 py-1.5 rounded-xl bg-slate-100 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Selected
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onApplyCrop(alt.crop)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                        isTopRanked
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      <span>Switch to {alt.crop}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
