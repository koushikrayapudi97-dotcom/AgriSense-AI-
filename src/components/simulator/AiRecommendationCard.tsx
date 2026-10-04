import React, { useState } from 'react';
import { AIRecommendation, SimulationResult, SimulationInput } from '../../types/index.js';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  HelpCircle, 
  ArrowRight, 
  Sprout, 
  ChevronDown, 
  ChevronUp,
  BrainCircuit
} from 'lucide-react';
import { AgriSenseApiService } from '../../services/api.js';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface AiRecommendationCardProps {
  recommendation: AIRecommendation;
  explanation: string;
  input: SimulationInput;
  result: SimulationResult;
  onSelectAlternativeCrop?: (crop: any) => void;
}

export const AiRecommendationCard: React.FC<AiRecommendationCardProps> = ({
  recommendation,
  explanation,
  input,
  result,
  onSelectAlternativeCrop,
}) => {
  const { t, getCropName } = useLanguage();
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [isDeepExplaining, setIsDeepExplaining] = useState(false);
  const [deepText, setDeepText] = useState<string | null>(null);

  const handleDeepExplain = async () => {
    setExplanationOpen(true);
    if (!deepText) {
      setIsDeepExplaining(true);
      try {
        const res = await AgriSenseApiService.explainWithAI(input, result);
        setDeepText(res.explanation);
      } catch {
        setDeepText(explanation);
      } finally {
        setIsDeepExplaining(false);
      }
    }
  };

  return (
    <div className="bg-[#064e3b] text-white p-6 sm:p-7 rounded-2xl shadow-xl flex flex-col justify-between" id="ai-recommendation-card">
      <div>
        {/* Top Tag & System Engine Pill */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="bg-emerald-500 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded text-white shadow-xs">
            {t.aiStrategyBadge}
          </div>
          <span className="text-[11px] font-semibold text-emerald-200 bg-[#065f46] px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
            <BrainCircuit className="w-3 h-3 text-emerald-300" />
            <span>{recommendation.generatedBy || 'AgriSense-Rule-Engine'}</span>
          </span>
        </div>

        {/* Strategy Headline */}
        <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-3 text-white">
          {recommendation.headline}
        </h2>

        {/* Primary Strategy Description */}
        <p className="text-sm text-emerald-100/90 leading-relaxed font-normal mb-6">
          {recommendation.primaryRecommendation}
        </p>

        {/* 3-Column Structured Breakdown in Bento Grid style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-emerald-700/60 mb-6">
          {/* Why? Reasons */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.strategyDrivers}</span>
            </div>
            <div className="space-y-2">
              {recommendation.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-emerald-100/80">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                  <span className="leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Risk Warnings */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.riskVulnerabilities}</span>
            </div>
            <div className="space-y-2">
              {recommendation.riskWarnings.map((warning, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-100/80">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                  <span className="leading-snug">{warning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Action Plan */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-300 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
              <span>{t.recommendedActions}</span>
            </div>
            <div className="space-y-2">
              {recommendation.suggestedActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-emerald-100/80">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-1.5 shrink-0" />
                  <span className="leading-snug">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Climate-Smart Alternative Crop Banner */}
        {recommendation.alternativeCropSuggestion && (
          <div className="p-4 rounded-xl bg-[#065f46] border border-emerald-500/40 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner" id="alternative-crop-banner">
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span>{t.climateAlternative}: {getCropName(recommendation.alternativeCropSuggestion.crop)}</span>
                  <span className="text-[10px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded font-black uppercase">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {recommendation.alternativeCropSuggestion.reason}
                </p>
              </div>
            </div>

            {onSelectAlternativeCrop && (
              <button
                type="button"
                id="btn-switch-to-alternative-crop"
                onClick={() => onSelectAlternativeCrop(recommendation.alternativeCropSuggestion?.crop)}
                className="flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-sm transition self-start sm:self-center shrink-0 cursor-pointer"
              >
                <span>{t.testAlternative} ({getCropName(recommendation.alternativeCropSuggestion.crop)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* "Explain This Prediction" Accordion */}
      <div className="pt-4 border-t border-emerald-700/60 mt-2">
        <button
          type="button"
          id="btn-explain-this-prediction"
          onClick={() => {
            if (!explanationOpen) handleDeepExplain();
            else setExplanationOpen(false);
          }}
          className="flex items-center justify-between w-full text-xs font-bold text-emerald-200 hover:text-white transition py-1 cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-emerald-300" />
            <span>{t.explainPrediction}</span>
          </span>
          {explanationOpen ? <ChevronUp className="w-4 h-4 text-emerald-300" /> : <ChevronDown className="w-4 h-4 text-emerald-300" />}
        </button>

        {explanationOpen && (
          <div className="mt-3 p-4 rounded-xl bg-[#043327] border border-emerald-600/40 text-xs text-emerald-100 leading-relaxed">
            {isDeepExplaining ? (
              <div className="flex items-center space-x-2 text-emerald-300 py-1">
                <svg className="animate-spin h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{t.explainingWithAi}</span>
              </div>
            ) : (
              <p>{deepText || explanation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
