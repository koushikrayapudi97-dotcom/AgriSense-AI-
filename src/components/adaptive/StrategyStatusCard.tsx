import React from 'react';
import { StrategyStatus } from '../../types/index.js';
import { CheckCircle2, AlertCircle, AlertTriangle, ArrowRightLeft, ShieldCheck, ShieldAlert } from 'lucide-react';

interface StrategyStatusCardProps {
  status: StrategyStatus;
  reason: string;
}

export const StrategyStatusCard: React.FC<StrategyStatusCardProps> = ({ status, reason }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'CONTINUE':
        return {
          title: 'CONTINUE ORIGINAL STRATEGY',
          badgeText: '🟢 CONTINUE',
          bgClass: 'bg-emerald-50 border-emerald-300 text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-7 h-7 text-emerald-600" />,
          thresholdText: 'Conditions shifted < 5% in profit/risk variance. Yield stability remains within biological tolerances.',
        };
      case 'MONITOR':
        return {
          title: 'MONITOR KEY RISK FACTORS',
          badgeText: '🟡 MONITOR',
          bgClass: 'bg-amber-50/80 border-amber-300 text-amber-950',
          badgeBg: 'bg-amber-500 text-white',
          icon: <AlertCircle className="w-7 h-7 text-amber-600" />,
          thresholdText: 'Minor stress detected (5-15% profit softening or +6-15 risk pts). The original plan is viable with weather/market vigilance.',
        };
      case 'ADJUST':
        return {
          title: 'ADJUST INPUTS & WATER ALLOCATION',
          badgeText: '🟠 ADJUST',
          bgClass: 'bg-orange-50 border-orange-300 text-orange-950',
          badgeBg: 'bg-orange-600 text-white',
          icon: <AlertTriangle className="w-7 h-7 text-orange-600" />,
          thresholdText: 'Noticeable margin compression (15-35% profit drop or risk score 50-68). Adjust fertilizer dosing, reduce non-essential expenses, or adopt drip irrigation.',
        };
      case 'SWITCH_STRATEGY':
        return {
          title: 'SWITCH CROP STRATEGY RECOMMENDED',
          badgeText: '🔴 SWITCH STRATEGY',
          bgClass: 'bg-rose-50 border-rose-300 text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          icon: <ArrowRightLeft className="w-7 h-7 text-rose-600" />,
          thresholdText: 'Severe stress detected (>35% profit drop, risk score >=60, or negative margin). An alternative crop provides significantly higher risk-adjusted return.',
        };
      default:
        return {
          title: 'CONTINUE STRATEGY',
          badgeText: 'CONTINUE',
          bgClass: 'bg-slate-50 border-slate-300 text-slate-900',
          badgeBg: 'bg-slate-700 text-white',
          icon: <ShieldCheck className="w-7 h-7 text-slate-600" />,
          thresholdText: 'Standard operating baseline.',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`rounded-3xl p-6 sm:p-7 border ${config.bgClass} shadow-xs space-y-4`} id="strategy-status-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-2xl bg-white shadow-xs">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full ${config.badgeBg}`}>
                {config.badgeText}
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Automated Decision Classification
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black mt-1">
              {config.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-white space-y-2">
        <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
          {reason}
        </p>
        <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">Classification Threshold Logic: </span>
          {config.thresholdText}
        </div>
      </div>
    </div>
  );
};
