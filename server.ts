import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { CROPS_DATA } from './server/data/crops.js';
import { DEMO_TRAINING_DATASET } from './server/data/trainingData.js';
import { 
  runAgriculturalSimulation, 
  runWhatIfAnalysis, 
  getModelInfo,
  calculateRiskAnalysis
} from './server/ml/model.js';
import { 
  runAdaptiveResimulation, 
  evaluateAlternativeStrategies, 
  computeDecisionImpactSummary 
} from './server/ml/adaptiveEngine.js';
import { SimulationStorage, DecisionHistoryStorage } from './server/db/storage.js';
import { generateGeminiAgriculturalInsights } from './server/services/gemini.js';
import { 
  SimulationInput, 
  SimulationResult,
  CropName, 
  WhatIfInput,
  AdaptiveResimulateInput 
} from './src/types/index.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // -------------------------------------------------------------
  // API Routes
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      ml_model_status: 'ready',
      gemini_enabled: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Get crop definitions catalog
  app.get('/api/crops', (req, res) => {
    try {
      res.json({
        success: true,
        crops: CROPS_DATA,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message || 'Failed to fetch crops' });
    }
  });

  // Get ML model metadata and evaluation metrics
  app.get('/api/model-info', (req, res) => {
    try {
      const info = getModelInfo();
      res.json({
        success: true,
        modelInfo: info,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message || 'Failed to fetch model info' });
    }
  });

  // Get sample demo training dataset
  app.get('/api/dataset', (req, res) => {
    try {
      const limit = Math.min(200, parseInt(req.query.limit as string) || 50);
      const crop = req.query.crop as string;
      let data = DEMO_TRAINING_DATASET;
      if (crop) {
        data = data.filter(d => d.crop.toLowerCase() === crop.toLowerCase());
      }
      res.json({
        success: true,
        total: data.length,
        sample: data.slice(0, limit),
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message || 'Failed to fetch dataset' });
    }
  });

  // Run full simulation
  app.post('/api/simulate', async (req, res) => {
    try {
      const input: SimulationInput = req.body;

      // Validation
      if (!input.crop || !CROPS_DATA[input.crop]) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid crop selected. Valid crops: ${Object.keys(CROPS_DATA).join(', ')}` 
        });
      }

      if (typeof input.farmArea !== 'number' || input.farmArea <= 0 || input.farmArea > 1000) {
        return res.status(400).json({ 
          success: false, 
          error: 'Farm area must be a positive number between 0.1 and 1000 acres.' 
        });
      }

      if (typeof input.rainfall !== 'number' || input.rainfall < 0 || input.rainfall > 5000) {
        return res.status(400).json({ 
          success: false, 
          error: 'Rainfall must be between 0 and 5000 mm.' 
        });
      }

      if (typeof input.temperature !== 'number' || input.temperature < -10 || input.temperature > 65) {
        return res.status(400).json({ 
          success: false, 
          error: 'Temperature must be between -10°C and 65°C.' 
        });
      }

      if (typeof input.productionCost !== 'number' || input.productionCost < 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Production cost cannot be negative.' 
        });
      }

      if (typeof input.expectedMarketPrice !== 'number' || input.expectedMarketPrice < 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Market price cannot be negative.' 
        });
      }

      // 1. Run local agronomic ML simulation
      const result = runAgriculturalSimulation(input);

      // 2. Optionally enrich with Gemini if available and requested
      if (process.env.GEMINI_API_KEY && req.query.use_gemini !== 'false') {
        const aiInsights = await generateGeminiAgriculturalInsights(input, result);
        if (aiInsights) {
          result.recommendation = aiInsights.recommendation;
          result.explanation = aiInsights.deepExplanation;
        }
      }

      // 3. Save simulation automatically to history
      SimulationStorage.save(result);

      res.json({
        success: true,
        result,
      });
    } catch (e: any) {
      console.error('Simulation error:', e);
      res.status(500).json({
        success: false,
        error: 'Unable to complete the simulation. Please verify your inputs and try again.',
        details: e.message,
      });
    }
  });

  // What-If analysis endpoint
  app.post('/api/what-if', (req, res) => {
    try {
      const whatIfInput: WhatIfInput = req.body;
      if (!whatIfInput.baseInput) {
        return res.status(400).json({ success: false, error: 'baseInput is required.' });
      }

      const result = runWhatIfAnalysis(whatIfInput);
      res.json({
        success: true,
        result,
      });
    } catch (e: any) {
      console.error('What-if error:', e);
      res.status(500).json({
        success: false,
        error: 'Unable to process What-If analysis.',
        details: e.message,
      });
    }
  });

  // Scenario comparison endpoint (compare multiple crops/conditions)
  app.post('/api/compare', (req, res) => {
    try {
      const { items } = req.body as { items: SimulationInput[] };
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Array of simulation inputs is required.' });
      }

      const results = items.map(inp => runAgriculturalSimulation(inp));

      // Identify best scenario by profit and risk-adjusted return
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

      res.json({
        success: true,
        results,
        analysis: {
          highestProfitIndex: bestProfitIdx,
          highestRoiIndex: bestRoiIdx,
          bestCropRecommendation: results[bestProfitIdx].crop,
        },
      });
    } catch (e: any) {
      console.error('Comparison error:', e);
      res.status(500).json({
        success: false,
        error: 'Unable to compare scenarios.',
        details: e.message,
      });
    }
  });

  // Deep AI explanation endpoint
  app.post('/api/explain-ai', async (req, res) => {
    try {
      const { input, result } = req.body;
      if (!input || !result) {
        return res.status(400).json({ success: false, error: 'input and result are required.' });
      }

      const aiInsights = await generateGeminiAgriculturalInsights(input, result);
      if (aiInsights) {
        return res.json({
          success: true,
          source: 'Gemini-3.7-Flash',
          recommendation: aiInsights.recommendation,
          explanation: aiInsights.deepExplanation,
        });
      } else {
        return res.json({
          success: true,
          source: 'AgriSense-Rule-Engine',
          recommendation: result.recommendation,
          explanation: result.explanation,
        });
      }
    } catch (e: any) {
      res.status(500).json({
        success: false,
        error: 'AI explanation unavailable. Using local simulation explanation.',
      });
    }
  });

  // History list
  app.get('/api/simulations', (req, res) => {
    try {
      const search = req.query.search as string;
      const crop = req.query.crop as string;
      const list = SimulationStorage.getAll(search, crop);
      res.json({
        success: true,
        simulations: list,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch history.' });
    }
  });

  // Save custom simulation
  app.post('/api/simulations', (req, res) => {
    try {
      const { result, title } = req.body;
      if (!result) {
        return res.status(400).json({ success: false, error: 'result is required' });
      }
      const saved = SimulationStorage.save(result, title);
      res.json({
        success: true,
        simulation: saved,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: 'Failed to save simulation.' });
    }
  });

  // Get single simulation by ID
  app.get('/api/simulations/:id', (req, res) => {
    try {
      const record = SimulationStorage.getById(req.params.id);
      if (!record) {
        return res.status(404).json({ success: false, error: 'Simulation not found.' });
      }
      res.json({
        success: true,
        simulation: record,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch simulation.' });
    }
  });

  // Delete simulation by ID
  app.delete('/api/simulations/:id', (req, res) => {
    try {
      const deleted = SimulationStorage.deleteById(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Simulation not found.' });
      }
      res.json({
        success: true,
        message: 'Simulation removed successfully.',
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: 'Failed to delete simulation.' });
    }
  });

  // -------------------------------------------------------------
  // Dynamic Re-Planning / Adaptive Decision Support Endpoints
  // -------------------------------------------------------------

  // 1. Re-simulate under changed conditions and evaluate strategy shift
  app.post('/api/adaptive/resimulate', async (req, res) => {
    try {
      const payload: AdaptiveResimulateInput = req.body;

      if (!payload.updated_conditions) {
        return res.status(400).json({
          success: false,
          error: 'updated_conditions is required for adaptive re-simulation.',
        });
      }

      // If baseline_simulation_id is passed, look it up
      if (payload.baseline_simulation_id && !payload.baseline_input) {
        const found = SimulationStorage.getById(payload.baseline_simulation_id);
        if (found) {
          payload.baseline_input = found.input;
        }
      }

      // Input validation for updated parameters
      if (payload.updated_conditions.rainfall !== undefined && payload.updated_conditions.rainfall < 0) {
        return res.status(400).json({
          success: false,
          error: 'Rainfall cannot be negative.',
        });
      }

      if (payload.updated_conditions.temperature !== undefined && (payload.updated_conditions.temperature < -20 || payload.updated_conditions.temperature > 70)) {
        return res.status(400).json({
          success: false,
          error: 'Temperature must be between -20°C and 70°C.',
        });
      }

      if (payload.updated_conditions.productionCost !== undefined && payload.updated_conditions.productionCost < 0) {
        return res.status(400).json({
          success: false,
          error: 'Production cost cannot be negative.',
        });
      }

      if (payload.updated_conditions.expectedMarketPrice !== undefined && payload.updated_conditions.expectedMarketPrice < 0) {
        return res.status(400).json({
          success: false,
          error: 'Market price cannot be negative.',
        });
      }

      // Run full adaptive re-simulation
      const adaptiveResult = runAdaptiveResimulation(payload);

      // Save to decision history for timeline & audit tracking
      DecisionHistoryStorage.save({
        simulation_id: payload.baseline_simulation_id || adaptiveResult.baseline.id || 'sim_active',
        parent_decision_id: payload.parent_decision_id,
        cycle_number: payload.parent_decision_id ? 2 : 1,
        crop: adaptiveResult.updated.crop,
        farm_area: adaptiveResult.updated.input.farmArea,
        rainfall: adaptiveResult.updated.input.rainfall,
        temperature: adaptiveResult.updated.input.temperature,
        water_availability: adaptiveResult.updated.input.waterAvailability,
        fertilizer_usage: adaptiveResult.updated.input.fertilizerUsage,
        production_cost: adaptiveResult.updated.input.productionCost,
        market_price: adaptiveResult.updated.input.expectedMarketPrice,
        predicted_yield: adaptiveResult.updated.predictedYieldPerAcre,
        revenue: adaptiveResult.updated.estimatedRevenue,
        profit: adaptiveResult.updated.expectedProfit,
        risk_score: adaptiveResult.updated.riskScore,
        risk_level: adaptiveResult.updated.riskLevel,
        strategy_status: adaptiveResult.strategy_status,
        recommendation_headline: adaptiveResult.recommendation.headline,
        recommended_crop: adaptiveResult.recommendation.recommendedCrop,
        updated_conditions: payload.updated_conditions,
        created_at: new Date().toISOString(),
      });

      res.json({
        success: true,
        baseline: adaptiveResult.baseline,
        updated: adaptiveResult.updated,
        changes: adaptiveResult.changes,
        changedFactors: adaptiveResult.changedFactors,
        strategy_status: adaptiveResult.strategy_status,
        statusReason: adaptiveResult.statusReason,
        statusBadgeColor: adaptiveResult.statusBadgeColor,
        alternatives: adaptiveResult.alternatives,
        recommendation: adaptiveResult.recommendation,
        explanation: adaptiveResult.explanation,
        timeline: adaptiveResult.timeline,
        disclaimer: adaptiveResult.disclaimer,
      });
    } catch (e: any) {
      console.error('Adaptive re-simulation error:', e);
      res.status(500).json({
        success: false,
        error: "We couldn't complete the updated simulation. Your original decision has not been changed.",
        details: e.message,
      });
    }
  });

  // 2. Direct comparison between baseline and updated strategy
  app.post('/api/adaptive/compare', (req, res) => {
    try {
      const { baseline, updated } = req.body as { baseline: SimulationResult; updated: SimulationResult };
      if (!baseline || !updated) {
        return res.status(400).json({ success: false, error: 'Both baseline and updated simulation results are required.' });
      }

      const changes = computeDecisionImpactSummary(baseline, updated);
      res.json({
        success: true,
        changes,
      });
    } catch (e: any) {
      res.status(500).json({
        success: false,
        error: 'Unable to calculate decision comparison.',
        details: e.message,
      });
    }
  });

  // 3. Evaluate alternative crop strategies under target conditions
  app.post('/api/adaptive/alternatives', (req, res) => {
    try {
      const { conditions, current_crop } = req.body as { conditions: SimulationInput; current_crop: CropName };
      if (!conditions) {
        return res.status(400).json({ success: false, error: 'conditions input is required.' });
      }

      const alternatives = evaluateAlternativeStrategies(conditions, current_crop || conditions.crop || 'Rice');
      res.json({
        success: true,
        alternatives,
      });
    } catch (e: any) {
      res.status(500).json({
        success: false,
        error: 'Alternative strategy analysis is temporarily unavailable.',
        details: e.message,
      });
    }
  });

  // 4. Decision history chain for a simulation
  app.get('/api/adaptive/history/:simulation_id', (req, res) => {
    try {
      const history = DecisionHistoryStorage.getBySimulationId(req.params.simulation_id);
      res.json({
        success: true,
        history,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch decision history.' });
    }
  });

  app.get('/api/adaptive/history', (req, res) => {
    try {
      const history = DecisionHistoryStorage.getAll();
      res.json({
        success: true,
        history,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch decision history.' });
    }
  });

  // -------------------------------------------------------------
  // Vite Integration / Static Frontend
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriSense AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
