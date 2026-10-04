import React from 'react';
import { SimulationResult, RiskLevel } from '../../types/index.js';
import { 
  Sprout, 
  TrendingUp, 
  Wallet, 
  CircleDollarSign, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface ResultKpiCardsProps {
  result: SimulationResult;
}

export const ResultKpiCards: React.FC<ResultKpiCardsProps> = ({ result }) => {
  const { t } = useLanguage();
  const isProfitable = result.expectedProfit >= 0;

  const getRiskDetails = (score: number, level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return {
          textColor: 'text-emerald-600',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          barColor: 'bg-emerald-500',
          icon: ShieldCheck,
          label: t.lowRisk,
          subtitle: 'Favorable environmental and price buffers',
        };
      case 'Moderate':
        return {
          textColor: 'text-amber-500',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          barColor: 'bg-amber-500',
          icon: AlertTriangle,
          label: t.modRisk,
          subtitle: 'Manageable sensitivity to weather/price shifts',
        };
      case 'High':
        return {
          textColor: 'text-orange-500',
          badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
          barColor: 'bg-orange-500',
          icon: ShieldAlert,
          label: t.highRisk,
          subtitle: 'Vulnerable to moisture or thermal deficits',
        };
      case 'Very High':
      default:
        return {
          textColor: 'text-rose-600',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
          barColor: 'bg-rose-500',
          icon: ShieldAlert,
          label: t.veryHighRisk,
          subtitle: 'Critical stress thresholds breached',
        };
    }
  };

  const riskInfo = getRiskDetails(result.riskScore, result.riskLevel);
  const RiskIcon = riskInfo.icon;

  return (
    <div className="space-y-4" id="simulation-kpi-results">
      {/* Bento Grid 4-Column Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bento Cell 1: Predicted Yield */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="kpi-predicted-yield">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.predictedYield}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline">
              <span className="text-3xl font-black text-slate-900">{result.predictedYieldPerAcre.toLocaleString('en-IN')}</span>
              <span className="text-sm font-medium text-slate-500 ml-1">{t.kgPerAcre}</span>
            </div>
            <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md self-start mt-2 inline-flex items-center space-x-1">
              <span>{t.totalHarvest}: {result.totalYield.toLocaleString('en-IN')} kg</span>
            </div>
          </div>
        </div>

        {/* Bento Cell 2: Estimated Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="kpi-expected-profit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.expectedProfit}</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isProfitable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-3xl font-black ${isProfitable ? 'text-slate-900' : 'text-rose-600'}`}>
              ₹{result.expectedProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center space-x-1.5">
              <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${isProfitable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {isProfitable ? `+${result.roiPercentage}% ${t.roi}` : `${result.roiPercentage}% ${t.roi}`}
              </span>
              <span>Net (₹{Math.round(result.totalCost / 1000)}k)</span>
            </div>
          </div>
        </div>

        {/* Bento Cell 3: Risk Level */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="kpi-risk-level-bento">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.riskLevel}</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${riskInfo.badgeBg}`}>
              <RiskIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-3xl font-black ${riskInfo.textColor}`}>{result.riskScore}</span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded-md self-start mt-2 inline-block uppercase ${riskInfo.badgeBg}`}>
              {riskInfo.label}
            </div>
          </div>
        </div>

        {/* Bento Cell 4: Selected Inputs Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="kpi-selected-inputs-bento">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.selectedInputs}</span>
          <div className="mt-2 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Area</span>
              <span className="font-bold text-slate-800">{result.input.farmArea} {result.input.farmArea === 1 ? 'Acre' : t.acres}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Rainfall</span>
              <span className="font-bold text-slate-800">{result.input.rainfall} mm</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Water / Fert</span>
              <span className="font-bold text-slate-800">{result.input.waterAvailability} / {result.input.fertilizerUsage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Financial Breakdown Secondary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Revenue Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.grossRevenue}</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">₹{result.estimatedRevenue.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-slate-500">Realized @ ₹{result.marketPricePerKg}/kg market price</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Cost Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.totalProductionCost}</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">₹{result.totalCost.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-slate-500">₹{result.productionCostPerAcre.toLocaleString('en-IN')}/acre across {result.input.farmArea} {t.acres}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
