import { 
  SimulationInput, 
  SimulationResult, 
  WhatIfInput, 
  WhatIfResult, 
  SimulationRecord, 
  ModelInfo, 
  CropProfile,
  CropName
} from '../types/index.js';
import { runAgriculturalSimulation, runWhatIfAnalysis, getModelInfo } from '../../server/ml/model.js';
import { CROPS_DATA } from '../../server/data/crops.js';

export const API_BASE = '/api';

export class AgriSenseApiService {
  // Check backend health
  static async checkHealth(): Promise<{ status: string; gemini_enabled: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error('Health check non-200');
      return await res.json();
    } catch {
      return { status: 'offline_fallback', gemini_enabled: false };
    }
  }

  // Get crops catalog
  static async getCrops(): Promise<Record<string, CropProfile>> {
    try {
      const res = await fetch(`${API_BASE}/crops`);
      if (!res.ok) throw new Error('Failed to fetch crops');
      const data = await res.json();
      return data.crops || CROPS_DATA;
    } catch {
      console.warn('Using local crops catalog fallback');
      return CROPS_DATA;
    }
  }

  // Get model metadata
  static async getModelInfo(): Promise<ModelInfo> {
    try {
      const res = await fetch(`${API_BASE}/model-info`);
      if (!res.ok) throw new Error('Failed to fetch model info');
      const data = await res.json();
      return data.modelInfo;
    } catch {
      console.warn('Using local model info fallback');
      return getModelInfo();
    }
  }

  // Run full simulation
  static async runSimulation(input: SimulationInput, useGemini = true): Promise<SimulationResult> {
    try {
      const res = await fetch(`${API_BASE}/simulate?use_gemini=${useGemini}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      return data.result;
    } catch (err: any) {
      console.warn('Backend API request failed, running client-side simulation engine fallback:', err);
      // Safe fallback logic ensures simulator never crashes
      return runAgriculturalSimulation(input);
    }
  }

  // What-If analysis
  static async runWhatIf(whatIfInput: WhatIfInput): Promise<WhatIfResult> {
    try {
      const res = await fetch(`${API_BASE}/what-if`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatIfInput),
      });

      if (!res.ok) throw new Error('What-if API failed');
      const data = await res.json();
      return data.result;
    } catch (err) {
      console.warn('Running client-side what-if fallback:', err);
      return runWhatIfAnalysis(whatIfInput);
    }
  }

  // Scenario / Crop Comparison
  static async compareScenarios(items: SimulationInput[]): Promise<{
    results: SimulationResult[];
    analysis: {
      highestProfitIndex: number;
      highestRoiIndex: number;
      bestCropRecommendation: CropName;
    };
  }> {
    try {
      const res = await fetch(`${API_BASE}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) throw new Error('Compare API failed');
      return await res.json();
    } catch (err) {
      console.warn('Running client-side compare fallback:', err);
      const results = items.map(inp => runAgriculturalSimulation(inp));
      let bestProfitIdx = 0;
      let maxProfit = -Infinity;
      let bestRoiIdx = 0;
      let maxRoi = -Infinity;

      results.forEach((r, idx) => {
        if (r.expectedProfit > maxProfit) {
          maxProfit = r.expectedProfit;
          bestProfitIdx = idx;
        }
        if (r.roiPercentage > maxRoi) {
          maxRoi = r.roiPercentage;
          bestRoiIdx = idx;
        }
      });

      return {
        results,
        analysis: {
          highestProfitIndex: bestProfitIdx,
          highestRoiIndex: bestRoiIdx,
          bestCropRecommendation: results[bestProfitIdx].crop,
        },
      };
    }
  }

  // Get simulations history
  static async getSimulations(search = '', crop = 'all'): Promise<SimulationRecord[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (crop && crop !== 'all') params.append('crop', crop);

      const res = await fetch(`${API_BASE}/simulations?${params.toString()}`);
      if (!res.ok) throw new Error('History API failed');
      const data = await res.json();
      return data.simulations || [];
    } catch {
      console.warn('History API unreachable');
      return [];
    }
  }

  // Delete simulation
  static async deleteSimulation(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/simulations/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Deep AI explanation
  static async explainWithAI(input: SimulationInput, result: SimulationResult) {
    try {
      const res = await fetch(`${API_BASE}/explain-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, result }),
      });
      if (!res.ok) throw new Error('AI explain failed');
      return await res.json();
    } catch {
      return {
        success: true,
        source: 'AgriSense-Rule-Engine',
        recommendation: result.recommendation,
        explanation: result.explanation,
      };
    }
  }

  // -------------------------------------------------------------
  // Dynamic Re-Planning / Adaptive Decision Support Client APIs
  // -------------------------------------------------------------

  // Run full adaptive re-simulation
  static async resimulateAdaptive(
    payload: import('../types/index.js').AdaptiveResimulateInput
  ): Promise<import('../types/index.js').AdaptiveResimulateResult> {
    try {
      const res = await fetch(`${API_BASE}/adaptive/resimulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "We couldn't complete the updated simulation. Your original decision has not been changed.");
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Backend adaptive resimulate error, using local adaptive engine fallback:', err);
      const { runAdaptiveResimulation } = await import('../../server/ml/adaptiveEngine.js');
      return runAdaptiveResimulation(payload);
    }
  }

  // Compare baseline and updated simulation
  static async compareAdaptive(
    baseline: SimulationResult,
    updated: SimulationResult
  ): Promise<import('../types/index.js').DecisionImpactSummary> {
    try {
      const res = await fetch(`${API_BASE}/adaptive/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseline, updated }),
      });
      if (!res.ok) throw new Error('Compare failed');
      const data = await res.json();
      return data.changes;
    } catch {
      const { computeDecisionImpactSummary } = await import('../../server/ml/adaptiveEngine.js');
      return computeDecisionImpactSummary(baseline, updated);
    }
  }

  // Evaluate alternative crop strategies
  static async getAdaptiveAlternatives(
    conditions: SimulationInput,
    currentCrop?: import('../types/index.js').CropName
  ): Promise<import('../types/index.js').AlternativeStrategyItem[]> {
    try {
      const res = await fetch(`${API_BASE}/adaptive/alternatives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditions, current_crop: currentCrop || conditions.crop }),
      });
      if (!res.ok) throw new Error('Alternatives failed');
      const data = await res.json();
      return data.alternatives || [];
    } catch {
      const { evaluateAlternativeStrategies } = await import('../../server/ml/adaptiveEngine.js');
      return evaluateAlternativeStrategies(conditions, currentCrop || conditions.crop || 'Rice');
    }
  }

  // Get decision history chain
  static async getAdaptiveHistory(
    simulationId?: string
  ): Promise<import('../types/index.js').DecisionHistoryRecord[]> {
    try {
      const url = simulationId 
        ? `${API_BASE}/adaptive/history/${simulationId}` 
        : `${API_BASE}/adaptive/history`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('History failed');
      const data = await res.json();
      return data.history || [];
    } catch {
      return [];
    }
  }
}
