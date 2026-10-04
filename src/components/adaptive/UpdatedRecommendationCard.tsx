import React from 'react';
import { AdaptiveRecommendation, CropName } from '../../types/index.js';
import { Sparkles, CheckCircle, AlertTriangle, ArrowRight, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface UpdatedRecommendationCardProps {
  recommendation: AdaptiveRecommendation;
  onSelectRecommendedCrop?: (crop: CropName) => void;
}

export const UpdatedRecommendationCard: React.FC<UpdatedRecommendationCardProps> = ({
  recommendation,
  onSelectRecommendedCrop,
}) => {
  const { getCropName } = useLanguage();
  const isSwitch = recommendation.isCropSwitchRecommended;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6" id="updated-recommendation-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 block">
              Adaptive Recommendation Engine
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              🔄 Updated AI Recommendation
            </h3>
          </div>
        </div>

        {recommendation.generatedBy && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit">
            Calibrated Model Output
          </span>
        )}
      </div>

      {/* Primary Headline Box */}
      <div className={`p-4 sm:p-5 rounded-2xl border ${
        isSwitch 
          ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-start space-x-3">
          {isSwitch ? (
            <ArrowRightLeft className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-black leading-snug">
              {recommendation.headline}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
              {recommendation.primaryRecommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Decision Impact Comparison (Original Strategy vs Recommended Strategy) */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Strategy Comparison
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Original Strategy */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Baseline Strategy</span>
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {recommendation.decisionImpactComparison.originalStrategy.crop}
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Profit:</span>
                <span className="font-black text-slate-900">
                  ₹{recommendation.decisionImpactComparison.originalStrategy.profit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score:</span>
                <span className="font-bold text-slate-700">
                  {recommendation.decisionImpactComparison.originalStrategy.risk}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Yield:</span>
                <span className="font-medium text-slate-700">
                  {recommendation.decisionImpactComparison.originalStrategy.yield} kg/ac
                </span>
              </div>
            </div>
          </div>

          {/* Updated / Recommended Strategy */}
          <div className={`p-4 rounded-xl border space-y-2 ${
            isSwitch ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-emerald-800 uppercase text-[10px]">
                {isSwitch ? 'Recommended Switch' : 'Updated Strategy'}
              </span>
              <span className="font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                {recommendation.decisionImpactComparison.updatedStrategy.crop}
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Profit:</span>
                <span className="font-black text-emerald-800">
                  ₹{recommendation.decisionImpactComparison.updatedStrategy.profit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Risk Score:</span>
                <span className="font-bold text-emerald-800">
                  {recommendation.decisionImpactComparison.updatedStrategy.risk}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Yield:</span>
                <span className="font-medium text-emerald-800">
                  {recommendation.decisionImpactComparison.updatedStrategy.yield} kg/ac
                </span>
              </div>
            </div>
          </div>
        </div>

        {isSwitch && onSelectRecommendedCrop && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => onSelectRecommendedCrop(recommendation.recommendedCrop)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span>Commit & Switch to {recommendation.recommendedCrop}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Why? Bullets */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Why did the AI reach this recommendation?
        </h4>
        <ul className="space-y-2 text-xs text-slate-700">
          {recommendation.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Actions */}
      {recommendation.suggestedActions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Suggested Farm Management Actions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {recommendation.suggestedActions.map((action, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
