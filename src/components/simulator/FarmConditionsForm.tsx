import React from 'react';
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
  Layers, 
  RotateCcw, 
  Sparkles, 
  Info,
  Sliders
} from 'lucide-react';
import { CROPS_DATA } from '../../../server/data/crops.js';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface FarmConditionsFormProps {
  input: SimulationInput;
  onChange: (input: SimulationInput) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  cropsData?: Record<string, CropProfile>;
}

export const FarmConditionsForm: React.FC<FarmConditionsFormProps> = ({
  input,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  cropsData = CROPS_DATA,
}) => {
  const { t, getCropName } = useLanguage();
  const currentCropProfile = cropsData[input.crop] || CROPS_DATA.Rice;

  // Handle crop change and auto-fill recommended benchmarks
  const handleCropChange = (crop: CropName) => {
    const profile = cropsData[crop] || CROPS_DATA[crop];
    onChange({
      ...input,
      crop,
      productionCost: profile ? profile.defaultCostPerAcre : input.productionCost,
      expectedMarketPrice: profile ? profile.defaultMarketPricePerKg : input.expectedMarketPrice,
    });
  };

  const waterOptions: WaterAvailability[] = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
  const fertilizerOptions: FertilizerUsage[] = ['Low', 'Medium', 'High'];

  // Dynamic climate tags
  const getRainfallBadge = (val: number) => {
    if (val < 400) return { label: 'Arid / Drought Risk', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (val < 750) return { label: 'Semi-Arid / Moderate', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (val < 1400) return { label: 'Optimal Kharif / Wet', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    return { label: 'Heavy Monsoonal Rain', color: 'bg-blue-50 text-blue-700 border-blue-200' };
  };

  const getTempBadge = (val: number) => {
    if (val < 18) return { label: 'Cool / Rabi Climate', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (val <= 33) return { label: 'Ideal Thermal Window', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val <= 38) return { label: 'Elevated Heat Stress', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Severe Heatwave Stress', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const rainBadge = getRainfallBadge(input.rainfall);
  const tempBadge = getTempBadge(input.temperature);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6" id="farm-conditions-card">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">{t.farmConditionsTitle}</h2>
            <p className="text-xs text-slate-500">{t.farmConditionsSubtitle}</p>
          </div>
        </div>
        <button
          type="button"
          id="btn-reset-form"
          onClick={onReset}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
          title={t.resetDefaults}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetDefaults}</span>
        </button>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4 sm:space-y-5"
        id="farm-conditions-form"
      >
        {/* Crop Selection */}
        <div>
          <label htmlFor="crop-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {t.cropSelection}
          </label>
          <div className="relative">
            <select
              id="crop-select"
              value={input.crop}
              onChange={e => handleCropChange(e.target.value as CropName)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition cursor-pointer"
            >
              {Object.keys(cropsData).map(cropKey => (
                <option key={cropKey} value={cropKey}>
                  {getCropName(cropKey)} ({cropsData[cropKey].category})
                </option>
              ))}
            </select>
          </div>
          {currentCropProfile && (
            <p className="mt-1.5 text-[11px] text-slate-500 flex items-center space-x-1">
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{currentCropProfile.description}</span>
            </p>
          )}
        </div>

        {/* Farm Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="farm-area-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.farmArea} ({t.acres})
            </label>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {input.farmArea} {input.farmArea === 1 ? 'Acre' : t.acres}
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              id="farm-area-input"
              min="0.1"
              max="100"
              step="0.5"
              value={input.farmArea}
              onChange={e => onChange({ ...input, farmArea: Math.max(0.1, parseFloat(e.target.value) || 1) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="e.g. 5"
              required
            />
          </div>
        </div>

        {/* Rainfall Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="rainfall-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.seasonalRainfall}</span>
            </label>
            <span className="text-xs font-bold text-slate-900">
              {input.rainfall} mm
            </span>
          </div>
          <input
            type="range"
            id="rainfall-slider"
            min="0"
            max="3000"
            step="25"
            value={input.rainfall}
            onChange={e => onChange({ ...input, rainfall: parseInt(e.target.value) || 0 })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-medium">
            <span>0 mm</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${rainBadge.color}`}>
              {rainBadge.label}
            </span>
            <span>3000 mm</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="temperature-slider" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.avgTemperature}</span>
            </label>
            <span className="text-xs font-bold text-slate-900">
              {input.temperature} °C
            </span>
          </div>
          <input
            type="range"
            id="temperature-slider"
            min="10"
            max="50"
            step="1"
            value={input.temperature}
            onChange={e => onChange({ ...input, temperature: parseInt(e.target.value) || 25 })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-medium">
            <span>10 °C</span>
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${tempBadge.color}`}>
              {tempBadge.label}
            </span>
            <span>50 °C</span>
          </div>
        </div>

        {/* Water Availability */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span>{t.waterAvailability}</span>
          </label>
          <div className="grid grid-cols-5 gap-1" id="water-availability-selector">
            {waterOptions.map(opt => {
              const selected = input.waterAvailability === opt;
              return (
                <button
                  type="button"
                  key={opt}
                  id={`water-opt-${opt.toLowerCase().replace(' ', '-')}`}
                  onClick={() => onChange({ ...input, waterAvailability: opt })}
                  className={`py-2 px-1 text-[11px] font-semibold rounded-lg border transition text-center cursor-pointer ${
                    selected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fertilizer Usage */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.fertilizerUsage}</span>
          </label>
          <div className="grid grid-cols-3 gap-2" id="fertilizer-usage-selector">
            {fertilizerOptions.map(opt => {
              const selected = input.fertilizerUsage === opt;
              return (
                <button
                  type="button"
                  key={opt}
                  id={`fertilizer-opt-${opt.toLowerCase()}`}
                  onClick={() => onChange({ ...input, fertilizerUsage: opt })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition text-center cursor-pointer ${
                    selected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Economics (Cost & Price) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label htmlFor="cost-per-acre-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t.productionCost}
            </label>
            <div className="relative">
              <input
                type="number"
                id="cost-per-acre-input"
                min="0"
                step="500"
                value={input.productionCost}
                onChange={e => onChange({ ...input, productionCost: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="market-price-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t.expectedPrice}
            </label>
            <div className="relative">
              <input
                type="number"
                id="market-price-input"
                min="0.1"
                step="0.5"
                value={input.expectedMarketPrice}
                onChange={e => onChange({ ...input, expectedMarketPrice: Math.max(0.1, parseFloat(e.target.value) || 0.1) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Auto Predict Yield Switch */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="toggle-auto-predict-yield"
                checked={input.autoPredictYield}
                onChange={e => onChange({ ...input, autoPredictYield: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
              <label htmlFor="toggle-auto-predict-yield" className="text-xs font-bold text-slate-800 cursor-pointer">
                Auto Predict Yield (ML Random Forest)
              </label>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
              {input.autoPredictYield ? 'Active' : 'Manual'}
            </span>
          </div>

          {!input.autoPredictYield && (
            <div className="mt-2.5 animate-fadeIn">
              <label htmlFor="manual-expected-yield-input" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Manual Override Expected Yield (kg / acre)
              </label>
              <input
                type="number"
                id="manual-expected-yield-input"
                min="10"
                step="50"
                value={input.expectedYield || currentCropProfile.baseYieldPerAcre}
                onChange={e => onChange({ ...input, expectedYield: Math.max(10, parseInt(e.target.value) || 1000) })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900"
                placeholder="Enter custom yield"
              />
            </div>
          )}
        </div>

        {/* Submit & Reset Controls */}
        <div className="pt-3">
          <button
            type="submit"
            id="btn-run-simulation"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-black text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer ${
              isLoading
                ? 'bg-emerald-700/80 cursor-wait'
                : 'bg-[#16a34a] hover:bg-[#15803d] shadow-emerald-950/20 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{t.analyzingConditions}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.runDecisionSimulation}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
