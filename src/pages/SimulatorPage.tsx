import React, { useState } from 'react';
import { 
  SimulationInput, 
  SimulationResult, 
  CropProfile, 
  CropName 
} from '../types/index.js';
import { FarmConditionsForm } from '../components/simulator/FarmConditionsForm.js';
import { ResultKpiCards } from '../components/simulator/ResultKpiCards.js';
import { ScenarioTable } from '../components/simulator/ScenarioTable.js';
import { WhatIfWidget } from '../components/simulator/WhatIfWidget.js';
import { FactorImportanceChart } from '../components/simulator/FactorImportanceChart.js';
import { RiskBreakdownCard } from '../components/simulator/RiskBreakdownCard.js';
import { AiRecommendationCard } from '../components/simulator/AiRecommendationCard.js';
import { ChartsSection } from '../components/simulator/ChartsSection.js';
import { AdaptiveDecisionPanel } from '../components/adaptive/AdaptiveDecisionPanel.js';
import { 
  Sparkles, 
  GitCompare, 
  BookmarkCheck, 
  Share2, 
  Download,
  Check,
  Activity,
  Layers,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.js';

interface SimulatorPageProps {
  input: SimulationInput;
  result: SimulationResult | null;
  isLoading: boolean;
  onInputChange: (newInput: SimulationInput) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  onCompareWithOthers: () => void;
  cropsData: Record<string, CropProfile>;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  input,
  result,
  isLoading,
  onInputChange,
  onRunSimulation,
  onReset,
  onCompareWithOthers,
  cropsData,
}) => {
  const { t, getCropName } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [activeResultView, setActiveResultView] = useState<'adaptive' | 'all'>('adaptive');

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportSummary = () => {
    if (!result) return;
    const content = `AgriSense AI - Simulation Summary
Crop: ${result.crop} (${result.input.farmArea} Acres)
Predicted Yield: ${result.predictedYieldPerAcre} kg/acre (Total: ${result.totalYield} kg)
Gross Revenue: ₹${result.estimatedRevenue}
Total Cost: ₹${result.totalCost}
Expected Profit: ₹${result.expectedProfit} (ROI: ${result.roiPercentage}%)
Risk Score: ${result.riskScore}/100 (${result.riskLevel} Risk)

AI Strategy:
${result.recommendation.headline}
${result.recommendation.primaryRecommendation}

Date: ${new Date().toISOString()}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AgriSense_${result.crop}_Simulation.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-4 sm:py-6 space-y-6" id="simulator-page-container">
      {/* Bento Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {result ? `${t.activeSimulation}: ${getCropName(result.crop)} • ${result.input.farmArea} ${t.acres}` : t.tagline}
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
              {t.bentoLab}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {result 
              ? `Calibrated with Random Forest ML • ${result.input.soilType} soil, ${result.input.rainfall}mm precipitation, ${result.input.season} season` 
              : t.testTradeoffs}
          </p>
        </div>

        {/* Action Controls */}
        {result && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onCompareWithOthers}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.compareCrops}</span>
            </button>

            <button
              onClick={handleExportSummary}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs"
              title="Download text report"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export Report</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Two-Column Core Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Farm Conditions Form (4 cols on lg) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          <FarmConditionsForm
            input={input}
            onChange={onInputChange}
            onSubmit={onRunSimulation}
            onReset={onReset}
            isLoading={isLoading}
            cropsData={cropsData}
          />
        </div>

        {/* Right Column: Simulation Results & Analytics (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {result ? (
            <>
              {/* 1. KPI Metric Cards */}
              <ResultKpiCards result={result} />

              {/* View Selector Tabs */}
              <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-2xl w-fit text-xs font-black">
                <button
                  type="button"
                  onClick={() => setActiveResultView('adaptive')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
                    activeResultView === 'adaptive'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Adaptive Decision Engine (Dynamic Re-Planning)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveResultView('all')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
                    activeResultView === 'all'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Full Analytics & What-If Sandbox</span>
                </button>
              </div>

              {/* View 1: Adaptive Decision Engine */}
              {activeResultView === 'adaptive' && (
                <div className="space-y-6">
                  <AdaptiveDecisionPanel
                    baselineSimulation={result}
                    cropsData={cropsData}
                    onCommitNewPlan={(newInput) => {
                      onInputChange(newInput);
                      onRunSimulation();
                    }}
                  />
                </div>
              )}

              {/* View 2: Full Analytics & What-If Sandbox */}
              {activeResultView === 'all' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Interactive What-If Simulator */}
                  <WhatIfWidget
                    currentInput={result.input}
                    currentResult={result}
                    onApplyModifiedInput={(modified) => {
                      onInputChange(modified);
                      onRunSimulation();
                    }}
                  />

                  {/* Dynamic Scenario Simulation Table */}
                  <ScenarioTable scenarios={result.scenarios} />

                  {/* Interactive Visualizations */}
                  <ChartsSection result={result} />

                  {/* Factor Analysis & Risk Breakdown Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FactorImportanceChart featureImportance={result.featureImportance} />
                    <RiskBreakdownCard
                      riskScore={result.riskScore}
                      riskLevel={result.riskLevel}
                      riskDrivers={result.riskDrivers}
                    />
                  </div>

                  {/* AI Recommended Strategy & Explanation */}
                  <AiRecommendationCard
                    recommendation={result.recommendation}
                    explanation={result.explanation}
                    input={result.input}
                    result={result}
                    onSelectAlternativeCrop={(altCrop: CropName) => {
                      onInputChange({ ...input, crop: altCrop });
                      setTimeout(() => onRunSimulation(), 50);
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900">Awaiting Simulation Parameters</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust your farm conditions in the left panel and click &quot;Run Simulation&quot; to compute yield, profit, and risk projections.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
