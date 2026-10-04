export type CropName = 
  | 'Rice' 
  | 'Wheat' 
  | 'Maize' 
  | 'Cotton' 
  | 'Sugarcane' 
  | 'Groundnut' 
  | 'Tomato' 
  | 'Millet';

export type WaterAvailability = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
export type FertilizerUsage = 'Low' | 'Medium' | 'High';
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export interface CropProfile {
  id: CropName;
  name: string;
  category: string;
  season: string;
  optimalRainfallMin: number;
  optimalRainfallMax: number;
  optimalTempMin: number;
  optimalTempMax: number;
  waterRequirement: WaterAvailability;
  defaultCostPerAcre: number;
  defaultMarketPricePerKg: number;
  baseYieldPerAcre: number;
  yieldRangeMin: number;
  yieldRangeMax: number;
  fertilizerResponseFactor: number;
  riskSensitivity: {
    drought: number;
    excessWater: number;
    heatStress: number;
    priceVolatility: number;
  };
  description: string;
}

export interface SimulationInput {
  crop: CropName;
  farmArea: number; // in acres
  rainfall: number; // in mm (0 - 3000)
  temperature: number; // in °C (10 - 50)
  waterAvailability: WaterAvailability;
  fertilizerUsage: FertilizerUsage;
  productionCost: number; // ₹ / acre
  expectedMarketPrice: number; // ₹ / kg
  expectedYield?: number; // Optional manual yield in kg / acre
  autoPredictYield: boolean; // default true
  soilQuality?: 'Poor' | 'Average' | 'Rich';
  notes?: string;
}

export interface ScenarioOutcome {
  name: 'Optimistic' | 'Expected' | 'Pessimistic';
  label: string;
  description: string;
  yieldPerAcre: number;
  totalYield: number;
  costPerAcre: number;
  totalCost: number;
  revenue: number;
  profit: number;
  riskScore: number;
  riskLevel: RiskLevel;
  roi: number; // Return on investment %
  pricePerKg: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number; // 0 to 100 percentage
  description: string;
}

export interface RiskDriver {
  name: string;
  score: number; // 0 - 100
  weight: number;
  level: RiskLevel;
  impactDescription: string;
}

export interface AIRecommendation {
  primaryRecommendation: string;
  headline: string;
  reasons: string[];
  riskWarnings: string[];
  suggestedActions: string[];
  alternativeCropSuggestion?: {
    crop: CropName;
    reason: string;
    expectedProfitAdvantage: number;
  };
  generatedBy?: 'Gemini-3.7-Flash' | 'Gemini-3.1-Flash-Lite' | 'Gemini-Flash-Latest' | 'AgriSense-Rule-Engine' | string;
}

export interface RainfallYieldPoint {
  rainfall: number;
  predictedYield: number;
  isCurrent?: boolean;
}

export interface SimulationResult {
  id?: string;
  timestamp: string;
  input: SimulationInput;
  crop: CropName;
  predictedYieldPerAcre: number;
  totalYield: number; // predictedYieldPerAcre * farmArea
  productionCostPerAcre: number;
  totalCost: number; // productionCostPerAcre * farmArea
  marketPricePerKg: number;
  estimatedRevenue: number; // totalYield * marketPricePerKg
  expectedProfit: number; // estimatedRevenue - totalCost
  roiPercentage: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskDrivers: RiskDriver[];
  scenarios: ScenarioOutcome[];
  featureImportance: FeatureImportanceItem[];
  recommendation: AIRecommendation;
  explanation: string;
  rainfallCurve: RainfallYieldPoint[];
  dataSource: 'ML-Model-RandomForest' | 'Fallback-Heuristic';
  disclaimer: string;
}

export interface WhatIfInput {
  baseInput: SimulationInput;
  modificationType: 'rainfall' | 'price' | 'water' | 'fertilizer' | 'cost' | 'custom';
  rainfallDeltaPercent?: number; // e.g. -20 for -20%
  priceDeltaPercent?: number; // e.g. +15 for +15%
  newWaterAvailability?: WaterAvailability;
  newFertilizerUsage?: FertilizerUsage;
  costDeltaPercent?: number;
  customModifiedInput?: Partial<SimulationInput>;
}

export interface WhatIfResult {
  original: {
    yieldPerAcre: number;
    totalRevenue: number;
    totalProfit: number;
    riskScore: number;
    riskLevel: RiskLevel;
  };
  modified: {
    yieldPerAcre: number;
    totalRevenue: number;
    totalProfit: number;
    riskScore: number;
    riskLevel: RiskLevel;
  };
  deltas: {
    yieldChangeKg: number;
    yieldChangePercent: number;
    revenueChangeAmount: number;
    revenueChangePercent: number;
    profitChangeAmount: number;
    profitChangePercent: number;
    riskScoreChange: number;
  };
  summary: string;
  modifiedInput: SimulationInput;
}

export interface SimulationRecord extends SimulationResult {
  id: string;
  createdAt: string;
  title?: string;
}

export interface ModelMetrics {
  mae: number;
  rmse: number;
  r2Score: number;
  datasetSize: number;
  trainSamples: number;
  testSamples: number;
  algorithm: string;
  lastTrained: string;
}

export interface ModelInfo {
  name: string;
  version: string;
  algorithm: string;
  description: string;
  metrics: ModelMetrics;
  featureImportance: FeatureImportanceItem[];
  datasetOverview: {
    totalRecords: number;
    cropsRepresented: string[];
    rainfallRange: string;
    tempRange: string;
    label: string;
  };
  disclaimer: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  input: SimulationInput;
}

// -------------------------------------------------------------
// Dynamic Re-Planning / Adaptive Decision Support Types
// -------------------------------------------------------------

export type StrategyStatus = 'CONTINUE' | 'MONITOR' | 'ADJUST' | 'SWITCH_STRATEGY';

export interface MetricDelta {
  baseline: number;
  updated: number;
  diffAmount: number;
  diffPercent: number;
  isPositive: boolean;
  format: 'currency' | 'number' | 'percent' | 'score';
  unit?: string;
}

export interface DecisionImpactSummary {
  yield: MetricDelta;
  revenue: MetricDelta;
  cost: MetricDelta;
  profit: MetricDelta;
  risk: MetricDelta;
  roi: MetricDelta;
}

export interface AlternativeStrategyItem {
  crop: CropName;
  cropName: string;
  predictedYield: number;
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
  riskScore: number;
  riskLevel: RiskLevel;
  strategyScore: number; // 0-100 overall score
  suitability: 'High' | 'Medium' | 'Low';
  suitabilityReason: string;
  waterDemandMatch: string;
  profitAdvantageVsCurrent: number;
  isCurrentCrop: boolean;
  rank: number;
}

export interface AdaptiveRecommendation {
  headline: string;
  actionType: StrategyStatus;
  primaryRecommendation: string;
  reasons: string[];
  riskWarnings: string[];
  suggestedActions: string[];
  recommendedCrop: CropName;
  currentCrop: CropName;
  isCropSwitchRecommended: boolean;
  decisionImpactComparison: {
    originalStrategy: { crop: CropName; profit: number; risk: number; yield: number };
    updatedStrategy: { crop: CropName; profit: number; risk: number; yield: number };
    profitChange: number;
    riskChange: number;
  };
  generatedBy?: string;
}

export interface CausalChangeStep {
  factor: string;
  from: string | number;
  to: string | number;
  direction: 'up' | 'down' | 'neutral' | 'critical';
  impactText: string;
}

export interface RecommendationExplanationModel {
  summary: string;
  primaryDriver: string;
  causalChain: CausalChangeStep[];
  narrative: string;
}

export interface DecisionTimelineEvent {
  id: string;
  stepNumber: number;
  title: string;
  timestamp: string;
  crop: CropName;
  status: StrategyStatus;
  summary: string;
  keyMetrics: {
    profit: number;
    risk: number;
    yield: number;
  };
  triggerFactors?: string[];
}

export interface AdaptiveResimulateInput {
  baseline_simulation_id?: string;
  baseline_input?: SimulationInput;
  updated_conditions: Partial<SimulationInput>;
  parent_decision_id?: string;
  custom_title?: string;
}

export interface AdaptiveResimulateResult {
  id: string;
  timestamp: string;
  cycleNumber: number;
  baseline: SimulationResult;
  updated: SimulationResult;
  changes: DecisionImpactSummary;
  changedFactors: Array<{ factor: string; original: string | number; updated: string | number }>;
  strategy_status: StrategyStatus;
  statusReason: string;
  statusBadgeColor: string;
  alternatives: AlternativeStrategyItem[];
  recommendation: AdaptiveRecommendation;
  explanation: RecommendationExplanationModel;
  timeline: DecisionTimelineEvent[];
  disclaimer: string;
}

export interface DecisionHistoryRecord {
  id: string;
  simulation_id: string;
  parent_decision_id?: string;
  cycle_number: number;
  crop: CropName;
  farm_area: number;
  rainfall: number;
  temperature: number;
  water_availability: WaterAvailability;
  fertilizer_usage: FertilizerUsage;
  production_cost: number;
  market_price: number;
  predicted_yield: number;
  revenue: number;
  profit: number;
  risk_score: number;
  risk_level: RiskLevel;
  strategy_status: StrategyStatus;
  recommendation_headline: string;
  recommended_crop: CropName;
  created_at: string;
  updated_conditions?: Partial<SimulationInput>;
}
