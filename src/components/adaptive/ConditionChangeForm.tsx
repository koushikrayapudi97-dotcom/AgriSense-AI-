import React, { useState } from 'react';
import { 
  SimulationInput, 
  CropName, 
  WaterAvailability, 
  FertilizerUsage, 
  CropProfile 
} from '../../types/index.js';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Sprout, 
  CircleDollarSign, 
  Tag, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface ConditionChangeFormProps {
  originalInput: SimulationInput;
  updatedInput: SimulationInput;
  onChange: (updated: SimulationInput) => void;
  onReSimulate: () => void;
  isLoading: boolean;
  cropsData: Record<string, CropProfile>;
  onResetToBaseline: () => void;
}

export const ConditionChangeForm: React.FC<ConditionChangeFormProps> = ({
  originalInput,
  updatedInput,
  onChange,
  onReSimulate,
  isLoading,
  cropsData,
  onResetToBaseline,
}) => {
  const { t, getCropName } = useLanguage();

  // Presets for quick evaluation
  const handleApplyPreset = (preset: 'hackathon_drought' | 'severe_drought' | 'heatwave' | 'price_drop' | 'cost_spike') => {
    switch (preset) {
      case 'hackathon_drought': // Step 5 in hackathon prompt: Rainfall 580mm, Water Low, Temp 34°C
        onChange({
          ...updatedInput,
          rainfall: 580,
          waterAvailability: 'Low',
          temperature: 34,
        });
        break;
      case 'severe_drought':
        onChange({
          ...updatedInput,
          rainfall: 380,
          waterAvailability: 'Very Low',
          temperature: 37,
        });
        break;
      case 'heatwave':
        onChange({
          ...updatedInput,
          temperature: 39,
          rainfall: Math.max(100, originalInput.rainfall - 200),
          waterAvailability: 'Low',
        });
        break;
      case 'price_drop':
        onChange({
          ...updatedInput,
          expectedMarketPrice: Math.max(5, Number((originalInput.expectedMarketPrice * 0.75).toFixed(1))),
        });
        break;
      case 'cost_spike':
        onChange({
          ...updatedInput,
          productionCost: Math.round(originalInput.productionCost * 1.25),
        });
        break;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6" id="updated-conditions-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Updated Conditions Panel
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Side-by-side comparison of baseline parameters vs simulated change factors.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onResetToBaseline}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* Quick Test Presets Bar */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick Scenario Presets:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleApplyPreset('hackathon_drought')}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold border border-emerald-300 transition cursor-pointer"
          >
            ⭐ Hackathon Flow (Rainfall 580mm, Water Low, 34°C)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('severe_drought')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition cursor-pointer"
          >
            Severe Arid Stress (380mm, Very Low)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('heatwave')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition cursor-pointer"
          >
            Heatwave (39°C)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('price_drop')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition cursor-pointer"
          >
            Market Price Shock (-25%)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('cost_spike')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition cursor-pointer"
          >
            Input Inflation (+25%)
          </button>
        </div>
      </div>

      {/* Side-by-Side Parameter Matrix */}
      <div className="space-y-6">
        {/* Section 1: Environmental Factors */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Environmental Factors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rainfall */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Rainfall
                </span>
                <span className="text-[11px] text-slate-400">Original: {originalInput.rainfall} mm</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={100}
                  max={2500}
                  step={20}
                  value={updatedInput.rainfall}
                  onChange={(e) => onChange({ ...updatedInput, rainfall: Number(e.target.value) })}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="w-16 text-right font-black text-sm text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                  {updatedInput.rainfall} mm
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Arid (100)</span>
                <span className={updatedInput.rainfall !== originalInput.rainfall ? 'font-bold text-blue-600' : ''}>
                  {updatedInput.rainfall - originalInput.rainfall !== 0 
                    ? `${updatedInput.rainfall > originalInput.rainfall ? '+' : ''}${updatedInput.rainfall - originalInput.rainfall} mm` 
                    : 'Unchanged'}
                </span>
                <span>Heavy (2500)</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temperature
                </span>
                <span className="text-[11px] text-slate-400">Original: {originalInput.temperature}°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={15}
                  max={45}
                  step={1}
                  value={updatedInput.temperature}
                  onChange={(e) => onChange({ ...updatedInput, temperature: Number(e.target.value) })}
                  className="flex-1 accent-amber-600 cursor-pointer"
                />
                <span className="w-14 text-right font-black text-sm text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                  {updatedInput.temperature}°C
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Cool (15°)</span>
                <span className={updatedInput.temperature !== originalInput.temperature ? 'font-bold text-amber-600' : ''}>
                  {updatedInput.temperature - originalInput.temperature !== 0 
                    ? `${updatedInput.temperature > originalInput.temperature ? '+' : ''}${updatedInput.temperature - originalInput.temperature}°C` 
                    : 'Unchanged'}
                </span>
                <span>Hot (45°)</span>
              </div>
            </div>

            {/* Water Availability */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Water Supply
                </span>
                <span className="text-[11px] text-slate-400">Original: {originalInput.waterAvailability}</span>
              </div>
              <select
                value={updatedInput.waterAvailability}
                onChange={(e) => onChange({ ...updatedInput, waterAvailability: e.target.value as WaterAvailability })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Very Low">Very Low (Severe Deficit)</option>
                <option value="Low">Low (Restricted Irrigation)</option>
                <option value="Medium">Medium (Standard Supply)</option>
                <option value="High">High (Abundant Canal/Well)</option>
                <option value="Very High">Very High (Flood/Full Supply)</option>
              </select>
              <div className="text-[10px] text-slate-400 text-right">
                {updatedInput.waterAvailability !== originalInput.waterAvailability && (
                  <span className="font-bold text-cyan-600">Shifted from {originalInput.waterAvailability}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Agricultural Factors */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Agricultural Factors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fertilizer Usage */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Fertilizer Intensity (N-P-K)</span>
                <span className="text-[11px] text-slate-400">Original: {originalInput.fertilizerUsage}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Low', 'Medium', 'High'] as FertilizerUsage[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => onChange({ ...updatedInput, fertilizerUsage: level })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      updatedInput.fertilizerUsage === level
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Cultivar Selection */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Crop Cultivar</span>
                <span className="text-[11px] text-slate-400">Original: {originalInput.crop}</span>
              </div>
              <select
                value={updatedInput.crop}
                onChange={(e) => {
                  const newCrop = e.target.value as CropName;
                  const profile = cropsData[newCrop];
                  onChange({
                    ...updatedInput,
                    crop: newCrop,
                    productionCost: profile ? profile.defaultCostPerAcre : updatedInput.productionCost,
                    expectedMarketPrice: profile ? profile.defaultMarketPricePerKg : updatedInput.expectedMarketPrice,
                  });
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {Object.keys(cropsData).map((cropKey) => (
                  <option key={cropKey} value={cropKey}>
                    {cropKey} ({getCropName(cropKey as CropName)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Economic Factors */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <CircleDollarSign className="w-3.5 h-3.5 text-emerald-600" /> Economic Factors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Production Cost */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Production Cost (₹/acre)</span>
                <span className="text-[11px] text-slate-400">Original: ₹{originalInput.productionCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min={1000}
                  max={200000}
                  step={500}
                  value={updatedInput.productionCost}
                  onChange={(e) => onChange({ ...updatedInput, productionCost: Math.max(0, Number(e.target.value)) })}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Target Market Price */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Market Price (₹/kg)</span>
                <span className="text-[11px] text-slate-400">Original: ₹{originalInput.expectedMarketPrice}/kg</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min={1}
                  max={500}
                  step={0.5}
                  value={updatedInput.expectedMarketPrice}
                  onChange={(e) => onChange({ ...updatedInput, expectedMarketPrice: Math.max(0.1, Number(e.target.value)) })}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={onReSimulate}
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base transition shadow-md hover:shadow-emerald-600/20 cursor-pointer"
          id="resimulate-conditions-button"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Re-evaluating your farming strategy...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Play className="w-5 h-5 fill-white" />
              <span>Re-Simulate Conditions</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
