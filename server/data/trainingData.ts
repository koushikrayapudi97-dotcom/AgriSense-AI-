import { CropName, WaterAvailability, FertilizerUsage } from '../../src/types/index.js';
import { CROPS_DATA } from './crops.js';

export interface AgriculturalObservation {
  crop: CropName;
  rainfall: number; // mm
  temperature: number; // °C
  water_availability: WaterAvailability;
  fertilizer_usage: FertilizerUsage;
  production_cost: number; // ₹/acre
  market_price: number; // ₹/kg
  yield: number; // kg/acre
}

const WATER_NUMERIC: Record<WaterAvailability, number> = {
  'Very Low': 0.55,
  'Low': 0.75,
  'Medium': 1.0,
  'High': 1.15,
  'Very High': 1.25,
};

const FERTILIZER_NUMERIC: Record<FertilizerUsage, number> = {
  'Low': 0.82,
  'Medium': 1.0,
  'High': 1.18,
};

// Generates a realistic synthetic training dataset with real physical agronomic laws and slight stochastic variance
export function generateDemoTrainingDataset(): AgriculturalObservation[] {
  const dataset: AgriculturalObservation[] = [];
  const crops = Object.keys(CROPS_DATA) as CropName[];
  
  const rainfallVariations = [250, 400, 550, 700, 850, 1000, 1200, 1500, 1800, 2200];
  const tempVariations = [14, 18, 22, 26, 30, 34, 38, 42];
  const waterLevels: WaterAvailability[] = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
  const fertilizerLevels: FertilizerUsage[] = ['Low', 'Medium', 'High'];

  // Deterministic pseudo-random seed generator
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (const crop of crops) {
    const profile = CROPS_DATA[crop];
    
    for (const rain of rainfallVariations) {
      for (const temp of tempVariations) {
        // Sample subset of combinations to get realistic dataset size ~400-500
        if (pseudoRandom() > 0.45) continue;

        for (const water of waterLevels) {
          if (pseudoRandom() > 0.6) continue;

          const fert = fertilizerLevels[Math.floor(pseudoRandom() * fertilizerLevels.length)];
          
          // Agronomic physiological calculation:
          // 1. Rainfall response curve (parabolic optimal curve)
          const midRain = (profile.optimalRainfallMin + profile.optimalRainfallMax) / 2;
          const rainSpan = profile.optimalRainfallMax - profile.optimalRainfallMin;
          const rainDev = Math.abs(rain - midRain) / (rainSpan * 0.75);
          let rainPenalty = 1 - Math.min(0.65, Math.pow(rainDev, 1.6) * 0.35);
          if (rain < profile.optimalRainfallMin * 0.5) rainPenalty *= (1 - profile.riskSensitivity.drought);
          if (rain > profile.optimalRainfallMax * 1.5) rainPenalty *= (1 - profile.riskSensitivity.excessWater);

          // 2. Temperature response curve
          const midTemp = (profile.optimalTempMin + profile.optimalTempMax) / 2;
          const tempSpan = profile.optimalTempMax - profile.optimalTempMin;
          const tempDev = Math.abs(temp - midTemp) / (tempSpan * 0.8);
          let tempPenalty = 1 - Math.min(0.60, Math.pow(tempDev, 1.8) * 0.30);
          if (temp > 40) tempPenalty *= (1 - profile.riskSensitivity.heatStress * 0.7);

          // 3. Water and Fertilizer response
          const waterFactor = WATER_NUMERIC[water];
          const fertFactor = FERTILIZER_NUMERIC[fert];

          // 4. Crop base yield with interaction terms
          let simulatedYield = profile.baseYieldPerAcre * rainPenalty * tempPenalty * (0.6 + 0.4 * waterFactor) * (0.7 + 0.3 * fertFactor);
          
          // Add realistic stochastic field variation (+/- 6%)
          const noise = 0.94 + pseudoRandom() * 0.12;
          simulatedYield = Math.round(Math.max(profile.yieldRangeMin * 0.6, Math.min(profile.yieldRangeMax * 1.15, simulatedYield * noise)));

          const costNoise = 0.95 + pseudoRandom() * 0.10;
          const priceNoise = 0.92 + pseudoRandom() * 0.16;

          dataset.push({
            crop,
            rainfall: rain,
            temperature: temp,
            water_availability: water,
            fertilizer_usage: fert,
            production_cost: Math.round(profile.defaultCostPerAcre * costNoise),
            market_price: Number((profile.defaultMarketPricePerKg * priceNoise).toFixed(1)),
            yield: simulatedYield,
          });
        }
      }
    }
  }

  return dataset;
}

export const DEMO_TRAINING_DATASET = generateDemoTrainingDataset();
