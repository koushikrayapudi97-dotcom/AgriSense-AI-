import React from 'react';
import { ModelInfo } from '../types/index.js';
import { 
  Cpu, 
  Database, 
  ShieldAlert, 
  Layers, 
  Scale,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { getModelInfo } from '../../server/ml/model.js';
import { useLanguage } from '../i18n/LanguageContext.js';

interface ModelInfoPageProps {
  modelInfo?: ModelInfo;
}

export const ModelInfoPage: React.FC<ModelInfoPageProps> = ({ modelInfo: propModelInfo }) => {
  const { getCropName } = useLanguage();
  
  // Always guarantee reliable fallback metadata so the page never fails to load
  const modelInfo: ModelInfo = propModelInfo || getModelInfo();

  return (
    <div className="py-4 sm:py-6 space-y-6 sm:space-y-8" id="model-info-page-container">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Machine Learning Model & Data Transparency
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                100% Operational
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Architectural disclosure of agronomic regression algorithms, feature schema, dataset partition, and validation metrics.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Model Architecture</span>
          <span className="text-xl font-black text-slate-900">{modelInfo.algorithm || 'Random Forest Regressor'}</span>
          <p className="text-xs text-slate-500 mt-1">100 Bootstrapped Trees</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Coefficient of Determination (R²)</span>
          <span className="text-xl font-black text-emerald-700">{modelInfo.metrics.r2Score}</span>
          <p className="text-xs text-slate-500 mt-1">Variance explained on test fold</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Mean Absolute Error (MAE)</span>
          <span className="text-xl font-black text-slate-900">{modelInfo.metrics.mae} kg/ac</span>
          <p className="text-xs text-slate-500 mt-1">Average absolute harvest error</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Training Dataset</span>
          <span className="text-xl font-black text-blue-700">{modelInfo.datasetOverview.totalRecords.toLocaleString()} Records</span>
          <p className="text-xs text-slate-500 mt-1">80/20 Train-Test Partition</p>
        </div>
      </div>

      {/* Dataset & Features Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features Input Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-emerald-600" />
            <h2>Feature Schema & Importance</h2>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {modelInfo.featureImportance.map((feat, idx) => (
              <li key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-900 block">{feat.feature}</span>
                  <span className="text-[11px] text-slate-500">{feat.description}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {feat.importance}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Crops Profile Catalog */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2>Supported Agricultural Crops ({modelInfo.datasetOverview.cropsRepresented.length})</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {modelInfo.datasetOverview.cropsRepresented.map(crop => (
              <div key={crop} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                  {crop.slice(0, 2)}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{crop}</span>
                  <span className="text-[10px] text-slate-500">{getCropName(crop)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mathematical & Risk Formula Disclosure */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
          <Scale className="w-5 h-5 text-amber-600" />
          <h2>Economic & Risk Composite Formula</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Financial Calculation Rules:</span>
            <p className="font-mono text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-800 mb-2">
              Total Yield = Predicted Yield (kg/acre) × Farm Area (acres)<br/>
              Total Revenue = Total Yield × Market Price (₹/kg)<br/>
              Total Cost = Cost per Acre (₹/acre) × Farm Area (acres)<br/>
              Net Profit = Total Revenue - Total Cost<br/>
              ROI (%) = (Net Profit / Total Cost) × 100
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Risk Weighting Architecture:</span>
            <ul className="space-y-1.5 text-[11px] list-disc list-inside">
              <li><strong>Water Deficit Weight: 30%</strong> (Groundwater and irrigation scarcity)</li>
              <li><strong>Rainfall Uncertainty Weight: 25%</strong> (Precipitation deviation from optimal crop bands)</li>
              <li><strong>Thermal Stress Weight: 20%</strong> (High heatwave or chilling temperature curve)</li>
              <li><strong>Market Volatility Weight: 15%</strong> (Sensitivity to price fluctuations)</li>
              <li><strong>Cost Inflation Weight: 10%</strong> (Fertilizer and input expense exposure)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics Notice */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Agricultural Decision Support Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          {modelInfo.disclaimer}
        </p>
      </div>
    </div>
  );
};
