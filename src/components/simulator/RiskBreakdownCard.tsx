import React from 'react';
import { RiskDriver, RiskLevel } from '../../types/index.js';
import { ShieldAlert, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

interface RiskBreakdownCardProps {
  riskScore: number;
  riskLevel: RiskLevel;
  riskDrivers: RiskDriver[];
}

export const RiskBreakdownCard: React.FC<RiskBreakdownCardProps> = ({
  riskScore,
  riskLevel,
  riskDrivers,
}) => {
  const getLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return { text: 'text-emerald-700', bg: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Moderate':
        return { text: 'text-amber-700', bg: 'bg-amber-500', pill: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'High':
        return { text: 'text-orange-700', bg: 'bg-orange-500', pill: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'Very High':
      default:
        return { text: 'text-rose-700', bg: 'bg-rose-500', pill: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="risk-analysis-card">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Risk Diagnostics
            </div>
            <h3 className="text-base font-bold text-slate-900">Multi-Factor Risk Analysis</h3>
          </div>
          <div className="text-right">
            <span className="text-base font-black text-slate-900">{riskScore}/100</span>
            <span className={`block text-[10px] font-bold px-2 py-0.5 rounded border ${getLevelColor(riskLevel).pill}`}>
              {riskLevel} Risk
            </span>
          </div>
        </div>

        {/* Major Risk Drivers List */}
        <div className="space-y-3.5" id="major-risk-drivers-list">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Factor Stress Decomposition
          </div>

          {riskDrivers.map((driver, idx) => {
            const style = getLevelColor(driver.level);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 flex items-center space-x-1.5">
                    <span>{driver.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (Weight: {Math.round(driver.weight * 100)}%)
                    </span>
                  </span>
                  <span className={`font-bold ${style.text}`}>
                    {driver.score}/100 ({driver.level})
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${style.bg}`}
                    style={{ width: `${Math.min(100, Math.max(4, driver.score))}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-500">
                  {driver.impactDescription}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Classifications Legend */}
      <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-4 gap-1 text-center text-[10px] font-semibold">
        <div className="p-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          0–30: Low
        </div>
        <div className="p-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          31–60: Mod
        </div>
        <div className="p-1.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
          61–80: High
        </div>
        <div className="p-1.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
          81–100: Critical
        </div>
      </div>
    </div>
  );
};
