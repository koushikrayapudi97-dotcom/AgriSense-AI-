import React from 'react';
import { SimulationResult } from '../../types/index.js';
import { 
  Award, 
  X, 
  Sprout, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  CloudRain, 
  Thermometer, 
  Droplets,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PresentationModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SimulationResult;
}

export const PresentationModeModal: React.FC<PresentationModeModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn" id="presentation-mode-modal">
      <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">AgriSense AI — Executive Judge Summary</h2>
                <span className="bg-amber-400/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                  Hackathon Pitch View
                </span>
              </div>
              <p className="text-xs text-slate-400">High-level synthesis of farm conditions, predictive yield, multi-factor risk, and AI strategy</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-900">
          {/* Section 1: Selected Crop & Farm Conditions */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Input Farm Profile</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {result.crop} • {result.input.farmArea} Acre(s)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rainfall</span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  <span>{result.input.rainfall} mm</span>
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Temperature</span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  <span>{result.input.temperature} °C</span>
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Water Supply</span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{result.input.waterAvailability}</span>
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Fertilizer Level</span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{result.input.fertilizerUsage} Usage</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Predictive Yield, Profit, and Risk KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">2. Predicted Harvest</span>
              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                  {result.predictedYieldPerAcre.toLocaleString('en-IN')} <span className="text-sm font-semibold text-emerald-700">kg/ac</span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">Total: {result.totalYield.toLocaleString('en-IN')} kg across {result.input.farmArea} ac</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Random Forest Regressor Output</span>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">3. Expected Net Profit</span>
              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-950">
                  ₹{result.expectedProfit.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-blue-800 mt-0.5">Revenue: ₹{result.estimatedRevenue.toLocaleString('en-IN')} • ROI: +{result.roiPercentage}%</p>
              </div>
              <span className="text-[10px] text-blue-700 font-medium">@ ₹{result.marketPricePerKg}/kg spot price</span>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">4. Multi-Factor Risk</span>
              <div className="my-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-950">
                  {result.riskScore} <span className="text-sm font-semibold text-amber-700">/ 100</span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5">{result.riskLevel} Risk Severity</p>
              </div>
              <span className="text-[10px] text-amber-700 font-medium">Composite of 5 stress vectors</span>
            </div>
          </div>

          {/* Section 3: Scenario Comparisons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              5. Dynamic Scenario Range (Stress-Test Matrix)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {result.scenarios.map((sc, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900">{sc.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-white border border-slate-200">
                      Risk {sc.riskScore}/100
                    </span>
                  </div>
                  <p className="text-slate-600">Yield: <strong>{sc.yieldPerAcre} kg/ac</strong></p>
                  <p className="text-slate-600">Profit: <strong className={sc.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>₹{sc.profit.toLocaleString('en-IN')}</strong> (ROI {sc.roi}%)</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: AI Recommendation & Verified Rationale */}
          <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>6. AI Recommended Strategy & Next Actions</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
              {result.recommendation.headline}
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed mb-4">
              {result.recommendation.primaryRecommendation}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80">
                <span className="text-emerald-300 font-bold block mb-1 text-[11px] uppercase">Verified Agronomic Drivers</span>
                <ul className="space-y-1 text-emerald-100 text-[11px]">
                  {result.recommendation.reasons.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/80">
                <span className="text-amber-300 font-bold block mb-1 text-[11px] uppercase">Risk Mitigations</span>
                <ul className="space-y-1 text-emerald-100 text-[11px]">
                  {result.recommendation.suggestedActions.slice(0, 3).map((a, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>AgriSense AI • Hackathon Evaluation Protocol</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};
