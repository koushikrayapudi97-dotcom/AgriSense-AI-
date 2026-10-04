import React from 'react';
import { RecommendationExplanationModel as ExplanationType } from '../../types/index.js';
import { HelpCircle, ArrowRight, ShieldCheck, TrendingDown, DollarSign, Sprout } from 'lucide-react';

interface RecommendationExplanationProps {
  explanation: ExplanationType;
}

export const RecommendationExplanation: React.FC<RecommendationExplanationProps> = ({ explanation }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6" id="recommendation-explanation-section">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Why Did the Recommendation Change?
          </h3>
          <p className="text-xs text-slate-500">
            Explainable AI decision breakdown tracking causality from weather shift to financial outcome.
          </p>
        </div>
      </div>

      {/* Visual Causal Chain Flow */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Causal Impact Propagation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Changed Condition */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-xs relative">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-blue-600">
              <span>1. Condition Shift</span>
              <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">🌦️</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {explanation.changedConditionsSummary}
            </p>
          </div>

          {/* Step 2: Agronomic Impact */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-amber-600">
              <span>2. Crop Physiology</span>
              <Sprout className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {explanation.agronomicImpact}
            </p>
          </div>

          {/* Step 3: Economic Impact */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-rose-600">
              <span>3. Financial Margin</span>
              <DollarSign className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {explanation.economicImpact}
            </p>
          </div>

          {/* Step 4: Better Alternative */}
          <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-300 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-emerald-800">
              <span>4. Strategic Adaptation</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <p className="text-xs font-semibold text-emerald-950 leading-snug">
              {explanation.whyAlternativeIsBetter}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
        <span className="font-bold text-slate-900 block mb-1">Agronomic Intelligence Synthesis:</span>
        {explanation.summaryExplanation}
      </div>
    </div>
  );
};
