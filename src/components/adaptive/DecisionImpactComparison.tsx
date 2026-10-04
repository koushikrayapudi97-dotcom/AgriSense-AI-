import React from 'react';
import { DecisionImpactSummary } from '../../types/index.js';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Scale } from 'lucide-react';

interface DecisionImpactComparisonProps {
  changes: DecisionImpactSummary;
  originalCrop: string;
  updatedCrop: string;
}

export const DecisionImpactComparison: React.FC<DecisionImpactComparisonProps> = ({
  changes,
  originalCrop,
  updatedCrop,
}) => {
  const metrics = [
    {
      label: 'Predicted Yield',
      delta: changes.yield,
      formatValue: (v: number) => `${v.toLocaleString('en-IN')} kg/ac`,
      isBetter: changes.yield.diffAmount >= 0,
      invertColor: false,
    },
    {
      label: 'Gross Revenue',
      delta: changes.revenue,
      formatValue: (v: number) => `₹${v.toLocaleString('en-IN')}`,
      isBetter: changes.revenue.diffAmount >= 0,
      invertColor: false,
    },
    {
      label: 'Total Production Cost',
      delta: changes.cost,
      formatValue: (v: number) => `₹${v.toLocaleString('en-IN')}`,
      isBetter: changes.cost.diffAmount <= 0, // Lower cost is better
      invertColor: true,
    },
    {
      label: 'Expected Net Profit',
      delta: changes.profit,
      formatValue: (v: number) => `₹${v.toLocaleString('en-IN')}`,
      isBetter: changes.profit.diffAmount >= 0,
      invertColor: false,
    },
    {
      label: 'Composite Risk Score',
      delta: changes.risk,
      formatValue: (v: number) => `${v}/100`,
      isBetter: changes.risk.diffAmount <= 0, // Lower risk is better
      invertColor: true,
    },
    {
      label: 'Return on Investment (ROI)',
      delta: changes.roi,
      formatValue: (v: number) => `${v}%`,
      isBetter: changes.roi.diffAmount >= 0,
      invertColor: false,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4" id="decision-impact-comparison">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Decision Impact: Baseline vs. Updated
            </h3>
            <p className="text-xs text-slate-500">
              Differential assessment of yield, revenue, margins, and risk exposure.
            </p>
          </div>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full w-fit">
          {originalCrop === updatedCrop ? originalCrop : `${originalCrop} → ${updatedCrop}`}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="py-2.5 px-3">Metric</th>
              <th className="py-2.5 px-3 text-right">Original (Baseline)</th>
              <th className="py-2.5 px-3 text-right">Updated</th>
              <th className="py-2.5 px-3 text-right">Absolute Change</th>
              <th className="py-2.5 px-3 text-right">Percentage / Score Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {metrics.map((m, idx) => {
              const diffAmount = m.delta.diffAmount;
              const diffPercent = m.delta.diffPercent;
              const isUnchanged = diffAmount === 0;

              return (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {m.label}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 font-mono">
                    {m.formatValue(m.delta.baseline)}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900 font-mono">
                    {m.formatValue(m.delta.updated)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {isUnchanged ? (
                      <span className="text-slate-400 font-normal">0 (No change)</span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        m.isBetter ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {diffAmount > 0 ? '+' : ''}{m.formatValue(diffAmount).replace('/100', ' pts').replace('%', '% pts')}
                        {diffAmount > 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5 inline" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5 inline" />
                        )}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {isUnchanged ? (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold">
                        Stable
                      </span>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        m.isBetter 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {diffPercent > 0 ? `+${diffPercent}%` : `${diffPercent}%`}
                        <span className="text-[10px] font-normal uppercase">
                          ({m.isBetter ? 'Favorable' : 'Unfavorable'})
                        </span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
