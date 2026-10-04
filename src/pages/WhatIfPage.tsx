import React from 'react';
import { SimulationInput, SimulationResult, CropProfile } from '../types/index.js';
import { WhatIfWidget } from '../components/simulator/WhatIfWidget.js';
import { ResultKpiCards } from '../components/simulator/ResultKpiCards.js';
import { Layers, Sparkles, ArrowRight } from 'lucide-react';

interface WhatIfPageProps {
  input: SimulationInput;
  result: SimulationResult;
  onApplyModifiedInput: (input: SimulationInput) => void;
  onNavigateToSimulator: () => void;
}

export const WhatIfPage: React.FC<WhatIfPageProps> = ({
  input,
  result,
  onApplyModifiedInput,
  onNavigateToSimulator,
}) => {
  return (
    <div className="py-4 sm:py-6 space-y-6" id="what-if-page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What-If Agricultural Sensitivity Lab
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Stress-Testing
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Test how unexpected shocks in rainfall, market prices, water cuts, or fertilizer costs alter your farm economics.
          </p>
        </div>

        <button
          onClick={onNavigateToSimulator}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition self-start sm:self-center"
        >
          <span>Open Full Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Baseline KPI Reference */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Current Baseline Farm State ({result.crop} • {result.input.farmArea} Acres)
        </div>
        <ResultKpiCards result={result} />
      </div>

      {/* Interactive What-If Simulator Module */}
      <WhatIfWidget
        currentInput={result.input}
        currentResult={result}
        onApplyModifiedInput={onApplyModifiedInput}
      />
    </div>
  );
};
