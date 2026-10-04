import { 
  SimulationInput, 
  SimulationResult, 
  CropName, 
  RiskLevel, 
  StrategyStatus, 
  DecisionImpactSummary, 
  AlternativeStrategyItem, 
  AdaptiveRecommendation, 
  RecommendationExplanationModel, 
  CausalChangeStep, 
  DecisionTimelineEvent, 
  AdaptiveResimulateInput, 
  AdaptiveResimulateResult 
} from '../../src/types/index.js';
import { CROPS_DATA } from '../data/crops.js';
import { runAgriculturalSimulation } from './model.js';

// -------------------------------------------------------------
// 1. Metric Delta Calculator
// -------------------------------------------------------------
export function computeDecisionImpactSummary(
  baseline: SimulationResult,
  updated: SimulationResult
): DecisionImpactSummary {
  const yieldDiff = updated.predictedYieldPerAcre - baseline.predictedYieldPerAcre;
  const yieldPct = baseline.predictedYieldPerAcre > 0 
    ? Number(((yieldDiff / baseline.predictedYieldPerAcre) * 100).toFixed(1)) 
    : 0;

  const revDiff = updated.estimatedRevenue - baseline.estimatedRevenue;
  const revPct = baseline.estimatedRevenue > 0 
    ? Number(((revDiff / baseline.estimatedRevenue) * 100).toFixed(1)) 
    : 0;

  const costDiff = updated.totalCost - baseline.totalCost;
  const costPct = baseline.totalCost > 0 
    ? Number(((costDiff / baseline.totalCost) * 100).toFixed(1)) 
    : 0;

  const profitDiff = updated.expectedProfit - baseline.expectedProfit;
  const profitPct = Math.abs(baseline.expectedProfit) > 0 
    ? Number(((profitDiff / Math.abs(baseline.expectedProfit)) * 100).toFixed(1)) 
    : 0;

  const riskDiff = updated.riskScore - baseline.riskScore;
  const riskPct = baseline.riskScore > 0 
    ? Number(((riskDiff / baseline.riskScore) * 100).toFixed(1)) 
    : 0;

  const roiDiff = updated.roiPercentage - baseline.roiPercentage;

  return {
    yield: {
      baseline: baseline.predictedYieldPerAcre,
      updated: updated.predictedYieldPerAcre,
      diffAmount: yieldDiff,
      diffPercent: yieldPct,
      isPositive: yieldDiff >= 0,
      format: 'number',
      unit: 'kg/ac',
    },
    revenue: {
      baseline: baseline.estimatedRevenue,
      updated: updated.estimatedRevenue,
      diffAmount: revDiff,
      diffPercent: revPct,
      isPositive: revDiff >= 0,
      format: 'currency',
      unit: '₹',
    },
    cost: {
      baseline: baseline.totalCost,
      updated: updated.totalCost,
      diffAmount: costDiff,
      diffPercent: costPct,
      isPositive: costDiff <= 0, // Lower cost is positive
      format: 'currency',
      unit: '₹',
    },
    profit: {
      baseline: baseline.expectedProfit,
      updated: updated.expectedProfit,
      diffAmount: profitDiff,
      diffPercent: profitPct,
      isPositive: profitDiff >= 0,
      format: 'currency',
      unit: '₹',
    },
    risk: {
      baseline: baseline.riskScore,
      updated: updated.riskScore,
      diffAmount: riskDiff,
      diffPercent: riskPct,
      isPositive: riskDiff <= 0, // Lower risk is positive
      format: 'score',
      unit: '/100',
    },
    roi: {
      baseline: baseline.roiPercentage,
      updated: updated.roiPercentage,
      diffAmount: roiDiff,
      diffPercent: roiDiff,
      isPositive: roiDiff >= 0,
      format: 'percent',
      unit: '%',
    },
  };
}

// -------------------------------------------------------------
// 2. Comprehensive Alternative Crop Search & Ranking
// -------------------------------------------------------------
export function evaluateAlternativeStrategies(
  updatedInput: SimulationInput,
  currentCrop: CropName
): AlternativeStrategyItem[] {
  const allCrops = Object.keys(CROPS_DATA) as CropName[];
  const simulatedList: Array<{
    crop: CropName;
    result: SimulationResult;
    strategyScore: number;
    suitability: 'High' | 'Medium' | 'Low';
    suitabilityReason: string;
    waterDemandMatch: string;
  }> = [];

  // Run simulation for all crops under the exact same environmental and economic farm conditions
  for (const crop of allCrops) {
    const profile = CROPS_DATA[crop];
    const cropSimInput: SimulationInput = {
      ...updatedInput,
      crop,
      // If user switched crop, preserve realistic default cost & price if not explicitly customized
      productionCost: crop === currentCrop 
        ? updatedInput.productionCost 
        : profile.defaultCostPerAcre,
      expectedMarketPrice: crop === currentCrop 
        ? updatedInput.expectedMarketPrice 
        : profile.defaultMarketPricePerKg,
    };

    const simRes = runAgriculturalSimulation(cropSimInput);

    // 1. Profit Score (0 to 40 pts)
    const profitPerAcre = simRes.expectedProfit / Math.max(0.1, updatedInput.farmArea || 1);
    const profitScore = Math.max(0, Math.min(40, (profitPerAcre / 45000) * 40));

    // 2. Risk Score (0 to 30 pts) - Lower risk yields higher score
    const riskScorePts = Math.max(0, Math.min(30, ((100 - simRes.riskScore) / 100) * 30));

    // 3. Resource & Climate Suitability Score (0 to 20 pts)
    let suitabilityPts = 0;
    const rainOptimal = updatedInput.rainfall >= profile.optimalRainfallMin && updatedInput.rainfall <= profile.optimalRainfallMax;
    const rainAcceptable = updatedInput.rainfall >= profile.optimalRainfallMin * 0.7 && updatedInput.rainfall <= profile.optimalRainfallMax * 1.3;
    if (rainOptimal) suitabilityPts += 8;
    else if (rainAcceptable) suitabilityPts += 4;

    const tempOptimal = updatedInput.temperature >= profile.optimalTempMin && updatedInput.temperature <= profile.optimalTempMax;
    if (tempOptimal) suitabilityPts += 6;
    else if (Math.abs(updatedInput.temperature - ((profile.optimalTempMin + profile.optimalTempMax) / 2)) <= 6) suitabilityPts += 3;

    let waterMatch = 'Medium';
    if (profile.waterRequirement === 'Very High' || profile.waterRequirement === 'High') {
      if (updatedInput.waterAvailability === 'High' || updatedInput.waterAvailability === 'Very High') {
        suitabilityPts += 6;
        waterMatch = 'High Match';
      } else {
        waterMatch = 'Deficit Stress';
      }
    } else if (profile.waterRequirement === 'Low' || profile.waterRequirement === 'Very Low') {
      if (updatedInput.waterAvailability === 'Low' || updatedInput.waterAvailability === 'Very Low' || updatedInput.waterAvailability === 'Medium') {
        suitabilityPts += 6;
        waterMatch = 'Excellent Arid Fit';
      } else {
        suitabilityPts += 4;
        waterMatch = 'Adequate';
      }
    } else {
      // Medium water requirement
      if (updatedInput.waterAvailability !== 'Very Low') {
        suitabilityPts += 5;
        waterMatch = 'Moderate Match';
      } else {
        waterMatch = 'Mild Deficit';
      }
    }

    // 4. Yield Efficiency & ROI buffer (0 to 10 pts)
    const roiPts = Math.max(0, Math.min(10, (simRes.roiPercentage / 100) * 10));

    const totalStrategyScore = Math.round(profitScore + riskScorePts + suitabilityPts + roiPts);

    // Suitability Category & Reason
    let suitability: 'High' | 'Medium' | 'Low' = 'Medium';
    let suitabilityReason = '';
    if (totalStrategyScore >= 70 && simRes.riskScore < 50) {
      suitability = 'High';
      suitabilityReason = `Well-suited to ${updatedInput.rainfall}mm rainfall and ${updatedInput.waterAvailability.toLowerCase()} water status with strong risk-adjusted returns.`;
    } else if (totalStrategyScore < 45 || simRes.riskScore >= 65 || simRes.expectedProfit <= 0) {
      suitability = 'Low';
      suitabilityReason = `High environmental stress or low margin under current ${updatedInput.temperature}°C temperature and ${updatedInput.waterAvailability.toLowerCase()} water conditions.`;
    } else {
      suitability = 'Medium';
      suitabilityReason = `Moderate viability; requires disciplined water management and cost containment.`;
    }

    simulatedList.push({
      crop,
      result: simRes,
      strategyScore: totalStrategyScore,
      suitability,
      suitabilityReason,
      waterDemandMatch: waterMatch,
    });
  }

  // Sort by strategy score descending
  simulatedList.sort((a, b) => b.strategyScore - a.strategyScore);

  // Find updated result for current crop to compute relative advantage
  const currentCropSim = simulatedList.find(s => s.crop === currentCrop);
  const currentCropProfit = currentCropSim ? currentCropSim.result.expectedProfit : 0;

  return simulatedList.map((item, index) => ({
    crop: item.crop,
    cropName: CROPS_DATA[item.crop]?.name || item.crop,
    predictedYield: item.result.predictedYieldPerAcre,
    revenue: item.result.estimatedRevenue,
    cost: item.result.totalCost,
    profit: item.result.expectedProfit,
    roi: item.result.roiPercentage,
    riskScore: item.result.riskScore,
    riskLevel: item.result.riskLevel,
    strategyScore: item.strategyScore,
    suitability: item.suitability,
    suitabilityReason: item.suitabilityReason,
    waterDemandMatch: item.waterDemandMatch,
    profitAdvantageVsCurrent: item.result.expectedProfit - currentCropProfit,
    isCurrentCrop: item.crop === currentCrop,
    rank: index + 1,
  }));
}

// -------------------------------------------------------------
// 3. Transparent Strategy Status Classifier
// -------------------------------------------------------------
export function classifyStrategyStatus(
  baseline: SimulationResult,
  updated: SimulationResult,
  alternatives: AlternativeStrategyItem[]
): { status: StrategyStatus; reason: string; badgeColor: string } {
  const profitDiff = updated.expectedProfit - baseline.expectedProfit;
  const profitPctDrop = baseline.expectedProfit > 0 
    ? ((baseline.expectedProfit - updated.expectedProfit) / baseline.expectedProfit) * 100 
    : 0;
  const riskIncrease = updated.riskScore - baseline.riskScore;

  const topAlt = alternatives[0];
  const isAltSignificantlyBetter = topAlt && !topAlt.isCurrentCrop && 
    (topAlt.profitAdvantageVsCurrent >= 8000 || topAlt.riskScore <= updated.riskScore - 20) &&
    topAlt.strategyScore >= 65;

  // RULE 1: SWITCH STRATEGY (Critical stress or severe loss)
  if (
    (updated.expectedProfit <= 0 && baseline.expectedProfit > 0) ||
    (profitPctDrop >= 35 && updated.riskScore >= 60) ||
    (updated.riskScore >= 70 && isAltSignificantlyBetter) ||
    (profitPctDrop >= 45) ||
    (updated.crop === 'Rice' && (updated.input.waterAvailability === 'Low' || updated.input.waterAvailability === 'Very Low') && updated.input.rainfall < 600)
  ) {
    const betterCrop = topAlt && !topAlt.isCurrentCrop ? topAlt.crop : 'an alternative crop';
    return {
      status: 'SWITCH_STRATEGY',
      reason: `Significant deterioration in profit (${profitPctDrop > 0 ? `-${profitPctDrop.toFixed(1)}%` : 'deficit'}) and elevated risk (${updated.riskScore}/100). Switching to ${betterCrop} delivers better risk-adjusted margins.`,
      badgeColor: 'red',
    };
  }

  // RULE 2: ADJUST (Moderate strain, cost or water rebalancing needed)
  if (
    (profitPctDrop >= 15 && profitPctDrop < 35) ||
    (riskIncrease >= 15 && updated.riskScore >= 50) ||
    (updated.totalCost > baseline.totalCost * 1.15) ||
    (updated.riskScore >= 58 && updated.riskScore < 70)
  ) {
    return {
      status: 'ADJUST',
      reason: `The original strategy is experiencing margin compression (-${profitPctDrop.toFixed(1)}% profit) or elevated risk (+${riskIncrease} pts). Agronomic adjustments (fertilizer dosing, irrigation allocation) are recommended.`,
      badgeColor: 'amber',
    };
  }

  // RULE 3: MONITOR (Slight softness, vigilance required)
  if (
    (profitPctDrop >= 5 && profitPctDrop < 15) ||
    (riskIncrease >= 6 && riskIncrease < 15) ||
    (Math.abs(updated.input.temperature - baseline.input.temperature) >= 4) ||
    (Math.abs(updated.input.rainfall - baseline.input.rainfall) >= 150)
  ) {
    return {
      status: 'MONITOR',
      reason: `Moderate environmental/economic fluctuation observed. Current crop plan remains acceptable, but close monitoring of local weather and commodity prices is advised.`,
      badgeColor: 'yellow',
    };
  }

  // RULE 4: CONTINUE (Stable or improved conditions)
  return {
    status: 'CONTINUE',
    reason: `Updated conditions are well within biological tolerances. Expected profit is resilient (${updated.expectedProfit >= baseline.expectedProfit ? 'improved' : 'stable'}) and risk is low. Maintain original plan.`,
    badgeColor: 'emerald',
  };
}

// -------------------------------------------------------------
// 4. Adaptive Recommendation Generator
// -------------------------------------------------------------
export function generateAdaptiveRecommendation(
  baseline: SimulationResult,
  updated: SimulationResult,
  status: StrategyStatus,
  alternatives: AlternativeStrategyItem[]
): AdaptiveRecommendation {
  const topAlt = alternatives[0] || {
    crop: updated.crop,
    profit: updated.expectedProfit,
    riskScore: updated.riskScore,
    predictedYield: updated.predictedYieldPerAcre,
    isCurrentCrop: true,
  };
  const isSwitch = status === 'SWITCH_STRATEGY' && !topAlt.isCurrentCrop;
  const recommendedCrop = isSwitch ? topAlt.crop : updated.crop;

  const reasons: string[] = [];
  const riskWarnings: string[] = [];
  const suggestedActions: string[] = [];

  // Analyze specific factor triggers
  const rainDelta = updated.input.rainfall - baseline.input.rainfall;
  const tempDelta = updated.input.temperature - baseline.input.temperature;
  const waterChanged = updated.input.waterAvailability !== baseline.input.waterAvailability;
  const priceDelta = updated.input.expectedMarketPrice - baseline.input.expectedMarketPrice;
  const costDelta = updated.input.productionCost - baseline.input.productionCost;

  if (rainDelta < -100) {
    reasons.push(`Precipitation decreased by ${Math.abs(rainDelta)} mm (from ${baseline.input.rainfall} to ${updated.input.rainfall} mm), depressing un-irrigated yield potential.`);
  } else if (rainDelta > 100) {
    reasons.push(`Rainfall increased by ${rainDelta} mm, improving baseline soil moisture reserves.`);
  }

  if (waterChanged) {
    reasons.push(`Farm water availability transitioned from ${baseline.input.waterAvailability} to ${updated.input.waterAvailability}, impacting physiological water satisfaction.`);
  }

  if (tempDelta >= 3) {
    reasons.push(`Mean temperature increased by +${tempDelta}°C (${baseline.input.temperature}°C → ${updated.input.temperature}°C), elevating evapotranspiration stress.`);
  }

  if (priceDelta !== 0) {
    reasons.push(`Target commodity price shifted from ₹${baseline.input.expectedMarketPrice} to ₹${updated.input.expectedMarketPrice}/kg (${priceDelta > 0 ? '+' : ''}${priceDelta.toFixed(1)} ₹/kg).`);
  }

  if (costDelta !== 0) {
    reasons.push(`Production expenses moved from ₹${baseline.input.productionCost} to ₹${updated.input.productionCost}/acre.`);
  }

  if (reasons.length === 0) {
    reasons.push(`Minor parameter adjustments evaluated against the baseline model.`);
  }

  // Risk warnings
  if (updated.riskScore >= 60) {
    riskWarnings.push(`Updated risk score is elevated at ${updated.riskScore}/100 (${updated.riskLevel} Risk).`);
  }
  if (updated.expectedProfit < baseline.expectedProfit * 0.7) {
    riskWarnings.push(`Profit potential has contracted by ₹${(baseline.expectedProfit - updated.expectedProfit).toLocaleString('en-IN')}.`);
  }
  if (updated.input.waterAvailability === 'Low' || updated.input.waterAvailability === 'Very Low') {
    riskWarnings.push(`Critical water scarcity could lead to terminal moisture stress during the flowering/grain-filling stage.`);
  }
  if (riskWarnings.length === 0) {
    riskWarnings.push(`Operating within safe risk boundaries (${updated.riskScore}/100).`);
  }

  // Suggested Actions based on strategy status
  if (isSwitch) {
    suggestedActions.push(`Consider reallocating acreage to ${topAlt.crop}, which yields ₹${topAlt.profit.toLocaleString('en-IN')} expected profit with lower risk (${topAlt.riskScore}/100).`);
    suggestedActions.push(`Procure certified ${topAlt.crop} seeds suited to ${updated.input.waterAvailability.toLowerCase()} moisture and regional climate.`);
    suggestedActions.push(`Save input costs by reducing high-water infrastructure expenditure.`);
  } else if (status === 'ADJUST') {
    suggestedActions.push('Optimize nitrogen split-dosing and introduce organic mulch to retain root-zone moisture.');
    suggestedActions.push('Cap non-essential chemical expenditures to protect gross margin per acre.');
    suggestedActions.push('Adopt micro-irrigation or deficit irrigation during early vegetative phases.');
  } else if (status === 'MONITOR') {
    suggestedActions.push('Track weekly rainfall forecasts and mandi spot arrival volumes closely.');
    suggestedActions.push('Ensure irrigation channels and pump equipment are serviced and operational.');
  } else {
    suggestedActions.push(`Proceed with scheduled planting for ${updated.crop} following standard agronomic package of practices.`);
    suggestedActions.push('Lock in forward price contracts where feasible to safeguard positive margins.');
  }

  let headline = '';
  let primaryRecommendation = '';

  if (isSwitch) {
    headline = `Consider Switching from ${updated.crop} to ${topAlt.crop} Under Updated Conditions`;
    primaryRecommendation = `The original strategy has become significantly higher risk due to decreased moisture and lower margins. ${topAlt.crop} offers a stronger risk-adjusted net profit of ₹${topAlt.profit.toLocaleString('en-IN')} (Risk: ${topAlt.riskScore}/100).`;
  } else if (status === 'ADJUST') {
    headline = `Maintain ${updated.crop} with Agronomic Input & Moisture Adjustments`;
    primaryRecommendation = `Proceed with ${updated.crop}, but adjust fertilizer intensity and irrigation schedules to safeguard against the ${updated.riskScore}/100 risk profile.`;
  } else if (status === 'MONITOR') {
    headline = `Continue ${updated.crop} Strategy with Heightened Climate Vigilance`;
    primaryRecommendation = `The original plan for ${updated.crop} remains viable. Monitor upcoming rainfall patterns and mandi prices before committing additional capital.`;
  } else {
    headline = `Optimal Conditions: Continue with Original ${updated.crop} Plan`;
    primaryRecommendation = `Updated parameters fully support the original ${updated.crop} cultivation strategy with robust expected profit (₹${updated.expectedProfit.toLocaleString('en-IN')}) and low risk.`;
  }

  return {
    headline,
    actionType: status,
    primaryRecommendation,
    reasons,
    riskWarnings,
    suggestedActions,
    recommendedCrop,
    currentCrop: updated.crop,
    isCropSwitchRecommended: isSwitch,
    decisionImpactComparison: {
      originalStrategy: {
        crop: baseline.crop,
        profit: baseline.expectedProfit,
        risk: baseline.riskScore,
        yield: baseline.predictedYieldPerAcre,
      },
      updatedStrategy: {
        crop: recommendedCrop,
        profit: isSwitch ? topAlt.profit : updated.expectedProfit,
        risk: isSwitch ? topAlt.riskScore : updated.riskScore,
        yield: isSwitch ? topAlt.predictedYield : updated.predictedYieldPerAcre,
      },
      profitChange: (isSwitch ? topAlt.profit : updated.expectedProfit) - baseline.expectedProfit,
      riskChange: (isSwitch ? topAlt.riskScore : updated.riskScore) - baseline.riskScore,
    },
    generatedBy: 'AgriSense-Adaptive-Decision-Engine',
  };
}

// -------------------------------------------------------------
// 5. Causal Explainability Generator ("Why did AI change recommendation?")
// -------------------------------------------------------------
export function generateCausalExplanation(
  baseline: SimulationResult,
  updated: SimulationResult,
  status: StrategyStatus,
  alternatives: AlternativeStrategyItem[]
): RecommendationExplanationModel {
  const steps: CausalChangeStep[] = [];

  // Step 1: Environmental changes
  if (baseline.input.rainfall !== updated.input.rainfall) {
    const dir = updated.input.rainfall > baseline.input.rainfall ? 'up' : 'down';
    steps.push({
      factor: 'Seasonal Rainfall',
      from: `${baseline.input.rainfall} mm`,
      to: `${updated.input.rainfall} mm`,
      direction: dir,
      impactText: dir === 'down' ? 'Reduced moisture reserves' : 'Increased soil moisture',
    });
  }

  if (baseline.input.waterAvailability !== updated.input.waterAvailability) {
    steps.push({
      factor: 'Water Availability',
      from: baseline.input.waterAvailability,
      to: updated.input.waterAvailability,
      direction: updated.input.waterAvailability === 'Low' || updated.input.waterAvailability === 'Very Low' ? 'critical' : 'neutral',
      impactText: 'Altered irrigation reliability index',
    });
  }

  if (baseline.input.temperature !== updated.input.temperature) {
    const dir = updated.input.temperature > baseline.input.temperature ? 'up' : 'down';
    steps.push({
      factor: 'Mean Temperature',
      from: `${baseline.input.temperature}°C`,
      to: `${updated.input.temperature}°C`,
      direction: dir,
      impactText: dir === 'up' ? 'Higher heat stress index' : 'Cooler vegetative cycle',
    });
  }

  // Step 2: Crop Yield Impact
  const yieldDir = updated.predictedYieldPerAcre >= baseline.predictedYieldPerAcre ? 'up' : 'down';
  steps.push({
    factor: `${updated.crop} Predicted Yield`,
    from: `${baseline.predictedYieldPerAcre.toLocaleString('en-IN')} kg/ac`,
    to: `${updated.predictedYieldPerAcre.toLocaleString('en-IN')} kg/ac`,
    direction: yieldDir,
    impactText: `${yieldDir === 'down' ? '-' : '+'}${Math.abs(updated.predictedYieldPerAcre - baseline.predictedYieldPerAcre)} kg/acre delta`,
  });

  // Step 3: Economic Profit Impact
  const profitDir = updated.expectedProfit >= baseline.expectedProfit ? 'up' : 'down';
  steps.push({
    factor: `${updated.crop} Expected Profit`,
    from: `₹${baseline.expectedProfit.toLocaleString('en-IN')}`,
    to: `₹${updated.expectedProfit.toLocaleString('en-IN')}`,
    direction: profitDir,
    impactText: `${profitDir === 'down' ? '-' : '+'}₹${Math.abs(updated.expectedProfit - baseline.expectedProfit).toLocaleString('en-IN')} net impact`,
  });

  // Step 4: Risk Score Impact
  const riskDir = updated.riskScore <= baseline.riskScore ? 'down' : 'up';
  steps.push({
    factor: 'Composite Risk Score',
    from: `${baseline.riskScore}/100`,
    to: `${updated.riskScore}/100`,
    direction: riskDir === 'up' ? 'critical' : 'down',
    impactText: `${updated.riskScore > baseline.riskScore ? '+' : ''}${updated.riskScore - baseline.riskScore} risk points`,
  });

  let primaryDriver = 'Environmental and market changes';
  if (Math.abs(updated.input.rainfall - baseline.input.rainfall) >= 120 || updated.input.waterAvailability !== baseline.input.waterAvailability) {
    primaryDriver = 'Precipitation and water availability deficit';
  } else if (Math.abs(updated.input.expectedMarketPrice - baseline.input.expectedMarketPrice) >= 5) {
    primaryDriver = 'Market price volatility';
  } else if (Math.abs(updated.input.temperature - baseline.input.temperature) >= 4) {
    primaryDriver = 'Thermal stress deviation';
  }

  const topAlt = alternatives[0];
  let narrative = '';
  if (status === 'SWITCH_STRATEGY' && topAlt && !topAlt.isCurrentCrop) {
    narrative = `The recommendation shifted to ${topAlt.crop} primarily because ${primaryDriver.toLowerCase()} degraded the biological yield and profit potential of ${updated.crop}, whereas ${topAlt.crop} thrives with lower resource intensity and generates ₹${topAlt.profit.toLocaleString('en-IN')} expected profit at a safer ${topAlt.riskScore}/100 risk score.`;
  } else if (status === 'ADJUST') {
    narrative = `The recommendation emphasizes input adjustment because while ${updated.crop} remains feasible, margin pressure and increased risk require lowering production cost and pacing water applications.`;
  } else if (status === 'MONITOR') {
    narrative = `The recommendation advises monitoring because mild fluctuations have been detected, but the underlying agronomic fundamentals for ${updated.crop} remain sound.`;
  } else {
    narrative = `The recommendation confirmed the original strategy because updated conditions remain favorable for ${updated.crop} with stable yields and healthy projected ROI.`;
  }

  return {
    summary: `Decision adjusted following a change in ${primaryDriver.toLowerCase()}.`,
    primaryDriver,
    causalChain: steps,
    narrative,
  };
}

// -------------------------------------------------------------
// 6. Complete Adaptive Re-Simulation Orchestrator
// -------------------------------------------------------------
export function runAdaptiveResimulation(
  input: AdaptiveResimulateInput
): AdaptiveResimulateResult {
  // 1. Resolve baseline simulation
  let baseline: SimulationResult;
  if (input.baseline_input) {
    baseline = runAgriculturalSimulation(input.baseline_input);
  } else {
    // Default baseline if none provided
    const defaultBaselineInput: SimulationInput = {
      crop: 'Rice',
      farmArea: 5,
      rainfall: 750,
      temperature: 30,
      waterAvailability: 'Medium',
      fertilizerUsage: 'Medium',
      productionCost: 35000,
      expectedMarketPrice: 25,
      autoPredictYield: true,
      notes: 'Default Baseline',
    };
    baseline = runAgriculturalSimulation(defaultBaselineInput);
  }

  // 2. Build updated simulation input
  const updatedInput: SimulationInput = {
    ...baseline.input,
    ...input.updated_conditions,
    // Preserve core flags
    autoPredictYield: input.updated_conditions.autoPredictYield !== undefined 
      ? input.updated_conditions.autoPredictYield 
      : baseline.input.autoPredictYield,
  };

  // 3. Validate inputs
  if (updatedInput.farmArea <= 0) updatedInput.farmArea = 5;
  if (updatedInput.rainfall < 0) updatedInput.rainfall = 0;
  if (updatedInput.temperature < -10) updatedInput.temperature = 25;
  if (updatedInput.productionCost < 0) updatedInput.productionCost = 20000;
  if (updatedInput.expectedMarketPrice < 0) updatedInput.expectedMarketPrice = 10;

  // 4. Run updated simulation
  const updated = runAgriculturalSimulation(updatedInput);

  // 5. Track changed factors
  const changedFactors: Array<{ factor: string; original: string | number; updated: string | number }> = [];
  if (baseline.input.rainfall !== updated.input.rainfall) {
    changedFactors.push({ factor: 'Rainfall (mm)', original: baseline.input.rainfall, updated: updated.input.rainfall });
  }
  if (baseline.input.temperature !== updated.input.temperature) {
    changedFactors.push({ factor: 'Temperature (°C)', original: baseline.input.temperature, updated: updated.input.temperature });
  }
  if (baseline.input.waterAvailability !== updated.input.waterAvailability) {
    changedFactors.push({ factor: 'Water Availability', original: baseline.input.waterAvailability, updated: updated.input.waterAvailability });
  }
  if (baseline.input.fertilizerUsage !== updated.input.fertilizerUsage) {
    changedFactors.push({ factor: 'Fertilizer Usage', original: baseline.input.fertilizerUsage, updated: updated.input.fertilizerUsage });
  }
  if (baseline.input.crop !== updated.input.crop) {
    changedFactors.push({ factor: 'Crop Cultivar', original: baseline.input.crop, updated: updated.input.crop });
  }
  if (baseline.input.productionCost !== updated.input.productionCost) {
    changedFactors.push({ factor: 'Production Cost (₹)', original: baseline.input.productionCost, updated: updated.input.productionCost });
  }
  if (baseline.input.expectedMarketPrice !== updated.input.expectedMarketPrice) {
    changedFactors.push({ factor: 'Market Price (₹/kg)', original: baseline.input.expectedMarketPrice, updated: updated.input.expectedMarketPrice });
  }

  // 6. Compute impact deltas
  const changes = computeDecisionImpactSummary(baseline, updated);

  // 7. Search and rank alternative crop strategies
  const alternatives = evaluateAlternativeStrategies(updatedInput, updated.crop);

  // 8. Classify Strategy Status
  const { status, reason, badgeColor } = classifyStrategyStatus(baseline, updated, alternatives);

  // 9. Generate Adaptive Recommendation
  const recommendation = generateAdaptiveRecommendation(baseline, updated, status, alternatives);

  // 10. Generate Causal Explanation
  const explanation = generateCausalExplanation(baseline, updated, status, alternatives);

  // 11. Construct Timeline Event Chain
  const now = new Date().toISOString();
  const timeline: DecisionTimelineEvent[] = [
    {
      id: `step_1_baseline_${Date.now()}`,
      stepNumber: 1,
      title: `Baseline Decision Snapshot (${baseline.crop})`,
      timestamp: baseline.timestamp || now,
      crop: baseline.crop,
      status: 'CONTINUE',
      summary: `Initial crop strategy formulated with expected profit of ₹${baseline.expectedProfit.toLocaleString('en-IN')} and risk of ${baseline.riskScore}/100.`,
      keyMetrics: {
        profit: baseline.expectedProfit,
        risk: baseline.riskScore,
        yield: baseline.predictedYieldPerAcre,
      },
    },
    {
      id: `step_2_condition_change_${Date.now()}`,
      stepNumber: 2,
      title: `Conditions Changed (${changedFactors.length} factors updated)`,
      timestamp: now,
      crop: baseline.crop,
      status,
      summary: `Parametric shift detected in ${changedFactors.map(f => f.factor).join(', ') || 'environmental indices'}.`,
      keyMetrics: {
        profit: updated.expectedProfit,
        risk: updated.riskScore,
        yield: updated.predictedYieldPerAcre,
      },
      triggerFactors: changedFactors.map(f => `${f.factor}: ${f.original} → ${f.updated}`),
    },
    {
      id: `step_3_resimulation_${Date.now()}`,
      stepNumber: 3,
      title: `Multi-Crop Re-Evaluation & Alternative Ranking`,
      timestamp: now,
      crop: recommendation.recommendedCrop,
      status,
      summary: `${alternatives.length} crop strategies evaluated under new conditions. Top strategy: ${recommendation.recommendedCrop} (${status.replace('_', ' ')}).`,
      keyMetrics: {
        profit: recommendation.decisionImpactComparison.updatedStrategy.profit,
        risk: recommendation.decisionImpactComparison.updatedStrategy.risk,
        yield: recommendation.decisionImpactComparison.updatedStrategy.yield,
      },
    },
  ];

  return {
    id: `adaptive_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now,
    cycleNumber: 1,
    baseline,
    updated,
    changes,
    changedFactors,
    strategy_status: status,
    statusReason: reason,
    statusBadgeColor: badgeColor,
    alternatives,
    recommendation,
    explanation,
    timeline,
    disclaimer: 'Recommendations are model-based estimates and should be combined with local agricultural expertise, current weather information, and verified market information before making real-world decisions.',
  };
}
