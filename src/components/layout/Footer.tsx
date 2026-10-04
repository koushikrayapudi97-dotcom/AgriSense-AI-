import React from 'react';
import { Sprout, ShieldAlert, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <span>AgriSense AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Smart Agricultural Decision Simulator designed to evaluate farming choices under uncertain climatic, water, and market conditions before seeds are planted.
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-slate-200 font-semibold mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Technology & ML Engine</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Powered by an Ensemble Random Forest Yield Regressor, physiological crop stress curves, and multi-variable economic risk weighting. Integrates Gemini AI for agronomic advisory.
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Important Reliability Notice</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Predictions are estimates generated from the available model and baseline training data and should not be treated as guaranteed agricultural outcomes. Always verify with local extension officers.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} AgriSense AI — Smart Agricultural Decision Simulator.</span>
          <span className="mt-2 sm:mt-0">Built for agricultural hackathon demonstration & real-world decision support.</span>
        </div>
      </div>
    </footer>
  );
};
