import React, { useState, useEffect } from 'react';
import { 
  SimulationResult, 
  SimulationInput, 
  CropName, 
  CropProfile, 
  AdaptiveResimulateResult 
} from '../../types/index.js';
import { AgriSenseApiService } from '../../services/api.js';
import { BaselineDecisionCard } from './BaselineDecisionCard.js';
import { HasSituationChangedCard } from './HasSituationChangedCard.js';
import { ConditionChangeForm } from './ConditionChangeForm.js';
import { StrategyStatusCard } from './StrategyStatusCard.js';
import { DecisionImpactComparison } from './DecisionImpactComparison.js';
import { AlternativeRanking } from './AlternativeRanking.js';
import { UpdatedRecommendationCard } from './UpdatedRecommendationCard.js';
import { RecommendationExplanation } from './RecommendationExplanation.js';
import { DecisionTimeline } from './DecisionTimeline.js';
import { VisualFlowCard } from './VisualFlowCard.js';
import { AlertCircle, CheckCircle, Info, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext.js';

interface AdaptiveDecisionPanelProps {
  baselineSimulation: SimulationResult;
  cropsData: Record<string, CropProfile>;
  onCommitNewPlan: (newInput: SimulationInput, newResult?: SimulationResult) => void;
}

export const AdaptiveDecisionPanel: React.FC<AdaptiveDecisionPanelProps> = ({
  baselineSimulation,
  cropsData,
  onCommitNewPlan,
}) => {
  const { t, getCropName } = useLanguage();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [updatedInput, setUpdatedInput] = useState<SimulationInput>({
    ...baselineSimulation.input,
  });
  const [adaptiveResult, setAdaptiveResult] = useState<AdaptiveResimulateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [decisionRound, setDecisionRound] = useState(1);

  // Sync with baseline changes
  useEffect(() => {
    setUpdatedInput({ ...baselineSimulation.input });
    // Reset previous adaptive outcome if baseline crop/inputs completely change from outside
    setAdaptiveResult(null);
  }, [baselineSimulation.id]);

  const handleResetToBaseline = () => {
    setUpdatedInput({ ...baselineSimulation.input });
    setErrorMessage(null);
  };

  const handleReSimulate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        baseline_simulation_id: baselineSimulation.id,
        baseline_input: baselineSimulation.input,
        updated_conditions: updatedInput,
        current_crop: baselineSimulation.crop,
        decision_round: decisionRound + 1,
      };

      const result = await AgriSenseApiService.resimulateAdaptive(payload);
      setAdaptiveResult(result);
      setDecisionRound((prev) => prev + 1);
      setSuccessToast('Updated scenario evaluated successfully.');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      console.error('Failed to run adaptive re-simulation:', err);
      setErrorMessage(
        err.message || "We couldn't complete the updated simulation. Your original decision has not been changed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCrop = (crop: CropName) => {
    const profile = cropsData[crop];
    const newPlanInput: SimulationInput = {
      ...updatedInput,
      crop,
      productionCost: profile ? profile.defaultCostPerAcre : updatedInput.productionCost,
      expectedMarketPrice: profile ? profile.defaultMarketPricePerKg : updatedInput.expectedMarketPrice,
    };

    onCommitNewPlan(newPlanInput);
    setSuccessToast(`Committed strategy switch to ${crop}. Main simulator updated.`);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  return (
    <div className="space-y-6" id="adaptive-decision-engine-module">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start space-x-3 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Simulation Notice:</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 1. Baseline Decision Snapshot */}
      <BaselineDecisionCard baseline={baselineSimulation} />

      {/* 2. Has the situation changed? Banner */}
      <HasSituationChangedCard
        onOpenUpdatePanel={() => setIsFormOpen(!isFormOpen)}
        isOpen={isFormOpen}
        activeRound={decisionRound}
      />

      {/* 3. Condition Change Panel (Expandable or always visible when open) */}
      {isFormOpen && (
        <ConditionChangeForm
          originalInput={baselineSimulation.input}
          updatedInput={updatedInput}
          onChange={setUpdatedInput}
          onReSimulate={handleReSimulate}
          isLoading={isLoading}
          cropsData={cropsData}
          onResetToBaseline={handleResetToBaseline}
        />
      )}

      {/* 4. Adaptive Results (Displayed after re-simulation) */}
      {adaptiveResult && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
          {/* Strategy Status Classification */}
          <StrategyStatusCard
            status={adaptiveResult.strategy_status}
            reason={adaptiveResult.statusReason}
          />

          {/* Visual Flowchart */}
          <VisualFlowCard data={adaptiveResult} />

          {/* Decision Impact Comparison Table */}
          <DecisionImpactComparison
            changes={adaptiveResult.changes}
            originalCrop={adaptiveResult.baseline.crop}
            updatedCrop={adaptiveResult.updated.crop}
          />

          {/* Updated AI Recommendation */}
          <UpdatedRecommendationCard
            recommendation={adaptiveResult.recommendation}
            onSelectRecommendedCrop={handleApplyCrop}
          />

          {/* Alternative Strategy Ranking */}
          <AlternativeRanking
            alternatives={adaptiveResult.alternatives}
            currentCrop={adaptiveResult.updated.crop}
            onApplyCrop={handleApplyCrop}
          />

          {/* Explainability Section: Why did the recommendation change? */}
          <RecommendationExplanation explanation={adaptiveResult.explanation} />

          {/* Decision History Timeline */}
          <DecisionTimeline events={adaptiveResult.timeline} />

          {/* Explicit Transparency & Risk Disclaimer */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-[11px] text-slate-500 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Agronomic Simulator Disclaimer: </span>
              <span>
                {adaptiveResult.disclaimer ||
                  'AgriSense AI provides probabilistic agricultural scenario simulations and risk projections based on historical agronomic research and empirical crop models. It does not provide guaranteed profit, guaranteed yield, or 100% accurate prediction. Agricultural outcomes remain subject to microclimate variations, unseasonal weather events, pest outbreaks, and spot market price volatility.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
