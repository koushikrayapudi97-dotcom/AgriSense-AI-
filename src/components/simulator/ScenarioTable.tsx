import React from 'react';
import { ScenarioOutcome } from '../../types/index.js';
import { Sparkles, SunMedium, CloudLightning } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface ScenarioTableProps {
  scenarios: ScenarioOutcome[];
}

export const ScenarioTable: React.FC<ScenarioTableProps> = ({ scenarios }) => {
  const { t } = useLanguage();

  const getScenarioIcon = (name: string) => {
    switch (name) {
      case 'Optimistic':
        return <SunMedium className="w-4 h-4 text-emerald-600" />;
      case 'Pessimistic':
        return <CloudLightning className="w-4 h-4 text-rose-500" />;
      case 'Expected':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getScenarioBadge = (name: string) => {
    switch (name) {
      case 'Optimistic':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pessimistic':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Expected':
      default:
        return 'bg-emerald-100/70 text-emerald-900 border-emerald-300 font-bold';
    }
  };

  const getRiskBarStyle = (score: number) => {
    if (score <= 30) return { bar: 'bg-emerald-500', track: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score <= 60) return { bar: 'bg-amber-500', track: 'bg-amber-100', text: 'text-amber-700' };
    if (score <= 80) return { bar: 'bg-orange-500', track: 'bg-orange-100', text: 'text-orange-700' };
    return { bar: 'bg-rose-500', track: 'bg-rose-100', text: 'text-rose-700' };
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm" id="scenario-simulation-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">{t.scenariosTitle}</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Stress-Testing
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.scenariosSubtitle}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse" id="scenarios-table">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[11px] font-bold">
              <th className="pb-3 px-3">{t.scenario}</th>
              <th className="pb-3 px-3 text-right">{t.yieldPerAcre}</th>
              <th className="pb-3 px-3 text-right">{t.totalCost}</th>
              <th className="pb-3 px-3 text-right">{t.grossRevenue}</th>
              <th className="pb-3 px-3 text-right">{t.netProfit}</th>
              <th className="pb-3 px-3 text-center">{t.roi} %</th>
              <th className="pb-3 px-4 text-center">{t.riskScore}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {scenarios.map((sc, idx) => {
              const isExpected = sc.name === 'Expected';
              const isProfitable = sc.profit >= 0;
              const riskStyle = getRiskBarStyle(sc.riskScore);

              return (
                <tr 
                  key={sc.name || idx}
                  className={`transition hover:bg-slate-50/70 ${isExpected ? 'bg-emerald-50/30' : ''}`}
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-2">
                      {getScenarioIcon(sc.name)}
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getScenarioBadge(sc.name)}`}>
                          {sc.label}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs line-clamp-1">
                          {sc.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    {sc.yieldPerAcre.toLocaleString('en-IN')} kg
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Total: {sc.totalYield.toLocaleString('en-IN')} kg
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right text-slate-700">
                    ₹{sc.totalCost.toLocaleString('en-IN')}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ₹{sc.costPerAcre.toLocaleString('en-IN')}/ac
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right text-slate-800 font-semibold">
                    ₹{sc.revenue.toLocaleString('en-IN')}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      @ ₹{sc.pricePerKg}/kg
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`font-black text-sm ${isProfitable ? 'text-emerald-700' : 'text-rose-600'}`}>
                      ₹{sc.profit.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      sc.roi >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {sc.roi >= 0 ? `+${sc.roi}%` : `${sc.roi}%`}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center space-x-2">
                      <div className={`w-14 h-2 ${riskStyle.track} rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full ${riskStyle.bar} rounded-full`}
                          style={{ width: `${Math.min(100, Math.max(8, sc.riskScore))}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${riskStyle.text}`}>
                        {sc.riskScore}%
                      </span>
                    </div>
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
