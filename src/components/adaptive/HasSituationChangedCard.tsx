import React from 'react';
import { RefreshCw, ArrowRight, Activity, CloudSun } from 'lucide-react';

interface HasSituationChangedCardProps {
  onOpenUpdatePanel: () => void;
  isOpen: boolean;
  activeRound?: number;
}

export const HasSituationChangedCard: React.FC<HasSituationChangedCardProps> = ({
  onOpenUpdatePanel,
  isOpen,
  activeRound = 1,
}) => {
  return (
    <div 
      className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-500/30 relative overflow-hidden transition-all"
      id="has-situation-changed-card"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Adaptive Decision Engine • Round {activeRound}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Has the situation changed?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Update the environmental, economic, or agricultural conditions to see whether your original farming strategy is still suitable or if switching crops delivers a safer return.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={onOpenUpdatePanel}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-md hover:shadow-emerald-500/20 transform active:scale-95 cursor-pointer"
            id="update-conditions-button"
          >
            <RefreshCw className={`w-4 h-4 ${isOpen ? 'rotate-180' : ''} transition-transform duration-300`} />
            <span>{isOpen ? 'Modify Changed Conditions' : 'Update Conditions'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
