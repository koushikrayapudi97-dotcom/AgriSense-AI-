import React, { useState } from 'react';
import { 
  SimulationInput, 
  SimulationResult, 
  WhatIfResult, 
  WaterAvailability, 
  FertilizerUsage 
} from '../../types/index.js';
import { AgriSenseApiService } from '../../services/api.js';
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  CloudRain, 
  CircleDollarSign, 
  Droplets, 
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface WhatIfWidgetProps {
  currentInput: SimulationInput;
  currentResult: SimulationResult;
  onApplyModifiedInput?: (newInput: SimulationInput) => void;
}

export const WhatIfWidget: React.FC<WhatIfWidgetProps> = ({
  currentInput,
  currentResult,
  onApplyModifiedInput,
}) => {
  const [activePreset, setActivePreset] = useState<string>('rain-minus-20');
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Custom interactive controls
  const [customRainDelta, setCustomRainDelta] = useState<number>(-20);
  const [customPriceDelta, setCustomPriceDelta] = useState<number>(15);
  const [customWater, setCustomWater] = useState<WaterAvailability>(currentInput.waterAvailability);
  const [customFertilizer, setCustomFertilizer] = useState<FertilizerUsage>(currentInput.fertilizerUsage);

  // Run What-If on mount or when base input changes
  React.useEffect(() => {
    runPreset('rain-minus-20');
  }, [currentInput]);

  const runPreset = async (presetId: string) => {
    setActivePreset(presetId);
    setIsCalculating(true);

    try {
      let res: WhatIfResult;
      switch (presetId) {
        case 'rain-minus-20':
          res = await AgriSenseApiService.runWhatIf({
            baseInput: currentInput,
            modificationType: 'rainfall',
            rainfallDeltaPercent: -20,
          });
          break;
        case 'rain-plus-20':
          res = await AgriSenseApiService.runWhatIf({
            baseInput: currentInput,
            modificationType: 'rainfall',
            rainfallDeltaPercent: 20,
          });
          break;
        case 'price-plus-15':
          res = await AgriSenseApiService.runWhatIf({
            baseInput: currentInput,
            modificationType: 'price',
            priceDeltaPercent: 15,
          });
          break;
        case 'water-low':
          res = await AgriSenseApiService.runWhatIf({
            baseInput: currentInput,
            modificationType: 'water',
            newWaterAvailability: 'Low',
          });
          break;
        case 'fert-high':
          res = await AgriSenseApiService.runWhatIf({
            baseInput: currentInput,
            modificationType: 'fertilizer',
            newFertilizerUsage: 'High',
          });
          break;
        case 'cost-plus-20':
          res = await AgriSenseApiService.runWhatIf({
            baseInput: currentInput,
            modificationType: 'cost',
            costDeltaPercent: 20,
          });
          break;
        default:
          res = await AgriSenseApiService.runWhatIf({
            baseInput: currentInput,
            modificationType: 'rainfall',
            rainfallDeltaPercent: -20,
          });
      }
      setWhatIfResult(res);
    } catch (e) {
      console.error('What-if analysis error:', e);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCustomRun = async () => {
    setIsCalculating(true);
    setActivePreset('custom');
    try {
      const res = await AgriSenseApiService.runWhatIf({
        baseInput: currentInput,
        modificationType: 'custom',
        customModifiedInput: {
          rainfall: Math.max(0, Math.round(currentInput.rainfall * (1 + customRainDelta / 100))),
          expectedMarketPrice: Number((currentInput.expectedMarketPrice * (1 + customPriceDelta / 100)).toFixed(1)),
          waterAvailability: customWater,
          fertilizerUsage: customFertilizer,
        },
      });
      setWhatIfResult(res);
    } catch (e) {
      console.error('Custom what-if error', e);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6" id="what-if-simulator-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">What-If Decision Simulator</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Instantly test single-factor variations without resetting your whole farm profile.
          </p>
        </div>

        {whatIfResult && onApplyModifiedInput && (
          <button
            type="button"
            id="btn-apply-whatif-to-main"
            onClick={() => onApplyModifiedInput(whatIfResult.modifiedInput)}
            className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition self-start sm:self-center"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply This Scenario</span>
          </button>
        )}
      </div>

      {/* Quick Presets Bar */}
      <div className="mb-5">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          One-Click What-If Scenarios
        </label>
        <div className="flex flex-wrap gap-2" id="what-if-preset-buttons">
          <button
            type="button"
            id="btn-whatif-rain-minus-20"
            onClick={() => runPreset('rain-minus-20')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              activePreset === 'rain-minus-20'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rainfall Drops -20%</span>
          </button>

          <button
            type="button"
            id="btn-whatif-price-plus-15"
            onClick={() => runPreset('price-plus-15')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              activePreset === 'price-plus-15'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Market Price Rises +15%</span>
          </button>

          <button
            type="button"
            id="btn-whatif-water-low"
            onClick={() => runPreset('water-low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              activePreset === 'water-low'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span>Water Becomes Low</span>
          </button>

          <button
            type="button"
            id="btn-whatif-cost-plus-20"
            onClick={() => runPreset('cost-plus-20')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              activePreset === 'cost-plus-20'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CircleDollarSign className="w-3.5 h-3.5 text-rose-500" />
            <span>Input Costs Surge +20%</span>
          </button>

          <button
            type="button"
            id="btn-whatif-fert-high"
            onClick={() => runPreset('fert-high')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              activePreset === 'fert-high'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>High Fertilizer Dosing</span>
          </button>
        </div>
      </div>

      {/* Before / After Visual Comparison Cards */}
      {whatIfResult ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3" id="whatif-delta-cards">
            {/* Delta 1: Yield */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Yield Impact
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-base font-bold text-slate-900">
                  {whatIfResult.modified.yieldPerAcre.toLocaleString('en-IN')} kg/ac
                </div>
                <div className={`flex items-center text-xs font-extrabold ${
                  whatIfResult.deltas.yieldChangeKg >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {whatIfResult.deltas.yieldChangeKg >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                  {whatIfResult.deltas.yieldChangeKg >= 0 ? `+${whatIfResult.deltas.yieldChangePercent}%` : `${whatIfResult.deltas.yieldChangePercent}%`}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Base: {whatIfResult.original.yieldPerAcre.toLocaleString('en-IN')} kg/ac
              </p>
            </div>

            {/* Delta 2: Revenue */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Revenue Shift
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-base font-bold text-slate-900">
                  ₹{whatIfResult.modified.totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className={`flex items-center text-xs font-extrabold ${
                  whatIfResult.deltas.revenueChangeAmount >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {whatIfResult.deltas.revenueChangeAmount >= 0 ? `+₹${whatIfResult.deltas.revenueChangeAmount.toLocaleString('en-IN')}` : `-₹${Math.abs(whatIfResult.deltas.revenueChangeAmount).toLocaleString('en-IN')}`}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Base: ₹{whatIfResult.original.totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Delta 3: Net Profit */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Net Profit Change
              </div>
              <div className="flex items-baseline justify-between">
                <div className={`text-base font-bold ${
                  whatIfResult.modified.totalProfit >= 0 ? 'text-emerald-900' : 'text-rose-700'
                }`}>
                  ₹{whatIfResult.modified.totalProfit.toLocaleString('en-IN')}
                </div>
                <div className={`flex items-center text-xs font-extrabold ${
                  whatIfResult.deltas.profitChangeAmount >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {whatIfResult.deltas.profitChangeAmount >= 0 ? `+${whatIfResult.deltas.profitChangePercent}%` : `${whatIfResult.deltas.profitChangePercent}%`}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Base: ₹{whatIfResult.original.totalProfit.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Delta 4: Risk */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Risk Score Shift
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-base font-bold text-slate-900">
                  {whatIfResult.modified.riskScore}/100
                </div>
                <div className={`text-xs font-extrabold ${
                  whatIfResult.deltas.riskScoreChange <= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {whatIfResult.deltas.riskScoreChange > 0 ? `+${whatIfResult.deltas.riskScoreChange} pts` : `${whatIfResult.deltas.riskScoreChange} pts`}
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {whatIfResult.modified.riskLevel} Risk ({whatIfResult.original.riskScore} base)
              </p>
            </div>
          </div>

          {/* Dynamic Summary Banner */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3 text-xs text-indigo-900 font-medium flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{whatIfResult.summary}</span>
            </span>
            {isCalculating && (
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin shrink-0 ml-2" />
            )}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-slate-400">
          Calculating what-if scenario...
        </div>
      )}
    </div>
  );
};
