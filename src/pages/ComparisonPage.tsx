import React, { useState, useEffect } from 'react';
import { 
  SimulationInput, 
  SimulationResult, 
  CropName, 
  CropProfile 
} from '../types/index.js';
import { AgriSenseApiService } from '../services/api.js';
import { 
  GitCompare, 
  Sprout, 
  TrendingUp, 
  ShieldAlert, 
  Award, 
  Check, 
  Plus, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { CROPS_DATA } from '../../server/data/crops.js';

interface ComparisonPageProps {
  baseInput: SimulationInput;
  cropsData: Record<string, CropProfile>;
  onSelectCropToSimulate: (crop: CropName) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  baseInput,
  cropsData,
  onSelectCropToSimulate,
}) => {
  const [selectedCrops, setSelectedCrops] = useState<CropName[]>(['Rice', 'Wheat', 'Maize']);
  const [comparisonResults, setComparisonResults] = useState<SimulationResult[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const availableCrops = Object.keys(cropsData) as CropName[];

  const runComparison = async () => {
    setIsComparing(true);
    try {
      const inputs: SimulationInput[] = selectedCrops.map(c => {
        const profile = cropsData[c] || CROPS_DATA[c];
        return {
          ...baseInput,
          crop: c,
          productionCost: profile ? profile.defaultCostPerAcre : baseInput.productionCost,
          expectedMarketPrice: profile ? profile.defaultMarketPricePerKg : baseInput.expectedMarketPrice,
        };
      });

      const res = await AgriSenseApiService.compareScenarios(inputs);
      setComparisonResults(res.results);
    } catch (e) {
      console.error('Comparison error', e);
    } finally {
      setIsComparing(false);
    }
  };

  useEffect(() => {
    runComparison();
  }, [selectedCrops, baseInput]);

  const handleToggleCrop = (crop: CropName) => {
    if (selectedCrops.includes(crop)) {
      if (selectedCrops.length > 2) {
        setSelectedCrops(selectedCrops.filter(c => c !== crop));
      }
    } else {
      if (selectedCrops.length < 4) {
        setSelectedCrops([...selectedCrops, crop]);
      }
    }
  };

  // Find best performing crop
  let bestProfitCrop = comparisonResults[0];
  let lowestRiskCrop = comparisonResults[0];

  comparisonResults.forEach(r => {
    if (r.expectedProfit > (bestProfitCrop?.expectedProfit ?? -Infinity)) {
      bestProfitCrop = r;
    }
    if (r.riskScore < (lowestRiskCrop?.riskScore ?? Infinity)) {
      lowestRiskCrop = r;
    }
  });

  // Chart data
  const chartData = comparisonResults.map(r => ({
    name: r.crop,
    yieldKg: r.predictedYieldPerAcre,
    revenue: r.estimatedRevenue,
    profit: r.expectedProfit,
    risk: r.riskScore,
    roi: r.roiPercentage,
  }));

  return (
    <div className="py-4 sm:py-6 space-y-6" id="comparison-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Crop & Scenario Comparison Matrix
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Side-by-Side
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate multiple crops simultaneously under identical rainfall ({baseInput.rainfall} mm) and temperature ({baseInput.temperature} °C).
          </p>
        </div>

        <button
          onClick={runComparison}
          disabled={isComparing}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Crop Selector Chips */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select 2 to 4 Crops to Compare:
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {selectedCrops.length} of 4 selected
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCrops.map(crop => {
            const isSelected = selectedCrops.includes(crop);
            return (
              <button
                key={crop}
                onClick={() => handleToggleCrop(crop)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{crop}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Winner Callout Card */}
      {bestProfitCrop && (
        <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Recommended Choice for Current Conditions</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {bestProfitCrop.crop} delivers the highest projected profit: ₹{bestProfitCrop.expectedProfit.toLocaleString('en-IN')} (ROI +{bestProfitCrop.roiPercentage}%)
            </h2>
            <p className="text-xs text-emerald-200">
              {lowestRiskCrop && lowestRiskCrop.crop !== bestProfitCrop.crop && (
                <span>Meanwhile, <strong>{lowestRiskCrop.crop}</strong> offers lower risk exposure ({lowestRiskCrop.riskScore}/100).</span>
              )}
            </p>
          </div>

          <button
            onClick={() => onSelectCropToSimulate(bestProfitCrop.crop)}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs shadow-sm transition shrink-0 self-start md:self-center"
          >
            Simulate {bestProfitCrop.crop} in Detail
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${selectedCrops.length} gap-4`}>
        {comparisonResults.map(res => {
          const isBest = res.crop === bestProfitCrop?.crop;
          return (
            <div
              key={res.crop}
              className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between relative overflow-hidden transition ${
                isBest ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              {isBest && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
                  Top Net Margin
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {res.crop.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{res.crop}</h3>
                    <span className="text-[11px] text-slate-500">{res.input.farmArea} Acre(s)</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs py-2 border-y border-slate-100 my-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Predicted Yield:</span>
                    <strong className="text-slate-800">{res.predictedYieldPerAcre.toLocaleString('en-IN')} kg/ac</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gross Revenue:</span>
                    <strong className="text-slate-800">₹{res.estimatedRevenue.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Cost:</span>
                    <strong className="text-slate-800">₹{res.totalCost.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expected Profit:</span>
                    <strong className={`font-extrabold ${res.expectedProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      ₹{res.expectedProfit.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROI %:</span>
                    <strong className="text-slate-800">+{res.roiPercentage}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Score:</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                      res.riskScore <= 30 ? 'bg-emerald-100 text-emerald-800' : res.riskScore <= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {res.riskScore}/100 ({res.riskLevel})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onSelectCropToSimulate(res.crop)}
                  className="w-full py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition"
                >
                  Configure {res.crop}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Comparison Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Net Profit by Crop (₹)</span>
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
                <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Expected Profit']} />
                <Bar dataKey="profit" name="Net Profit" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#059669' : '#e11d48'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Comparison Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Risk Score Comparison (0 - 100)</span>
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
                <YAxis domain={[0, 100]} unit="/100" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip formatter={(v: any) => [`${v} / 100`, 'Risk Score']} />
                <Bar dataKey="risk" name="Risk Score" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-risk-${index}`} fill={entry.risk > 60 ? '#e11d48' : entry.risk > 30 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
