import { GoogleGenAI } from '@google/genai';
import { SimulationInput, SimulationResult, AIRecommendation } from '../../src/types/index.js';

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch {
      aiClient = null;
    }
  }
  return aiClient;
}

// Cascade of supported models to try in case of temporary high demand (503 / 429)
const CANDIDATE_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

export async function generateGeminiAgriculturalInsights(
  input: SimulationInput,
  simResult: SimulationResult
): Promise<{ recommendation: AIRecommendation; deepExplanation: string } | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  const prompt = `You are a senior agricultural economist and agronomist for AgriSense AI.
Analyze this farm simulation output and provide structured, precise, verified agronomic insights.

Simulation Inputs:
- Crop: ${input.crop}
- Farm Area: ${input.farmArea} acres
- Seasonal Rainfall: ${input.rainfall} mm
- Mean Temperature: ${input.temperature} °C
- Water Availability: ${input.waterAvailability}
- Fertilizer Usage: ${input.fertilizerUsage}
- Production Cost: ₹${input.productionCost} / acre
- Target Market Price: ₹${input.expectedMarketPrice} / kg

Calculated Simulation Outputs:
- Predicted Yield: ${simResult.predictedYieldPerAcre} kg / acre (Total: ${simResult.totalYield} kg)
- Estimated Revenue: ₹${simResult.estimatedRevenue.toLocaleString('en-IN')}
- Total Cost: ₹${simResult.totalCost.toLocaleString('en-IN')}
- Expected Profit: ₹${simResult.expectedProfit.toLocaleString('en-IN')} (ROI: ${simResult.roiPercentage}%)
- Risk Score: ${simResult.riskScore}/100 (${simResult.riskLevel} Risk)
- Key Risk Drivers: ${simResult.riskDrivers.map(d => `${d.name}: ${d.score}/100 (${d.level})`).join(', ')}

Return a strict JSON object conforming to this format:
{
  "headline": "A short 1-sentence punchy headline summarizing feasibility and crop outlook",
  "primaryRecommendation": "1-2 sentences clear recommendation for the farmer",
  "reasons": [
    "3 to 4 specific bullet points with factual numbers from the input/output explaining why"
  ],
  "riskWarnings": [
    "2 to 3 specific climate, price or water risk warnings based on the data"
  ],
  "suggestedActions": [
    "3 concrete, actionable agronomic management practices (e.g. irrigation timing, soil mulching, forward contracting, nutrient dosing)"
  ],
  "deepExplanation": "A 2-3 sentence simple, non-jargon explanation of how the predicted yield, revenue, and profit were calculated from environmental conditions."
}`;

  // Try candidate models in order to handle spikes in demand smoothly
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (!text) continue;

      const parsed = JSON.parse(text);
      return {
        recommendation: {
          headline: parsed.headline || simResult.recommendation.headline,
          primaryRecommendation: parsed.primaryRecommendation || simResult.recommendation.primaryRecommendation,
          reasons: Array.isArray(parsed.reasons) && parsed.reasons.length > 0 ? parsed.reasons : simResult.recommendation.reasons,
          riskWarnings: Array.isArray(parsed.riskWarnings) && parsed.riskWarnings.length > 0 ? parsed.riskWarnings : simResult.recommendation.riskWarnings,
          suggestedActions: Array.isArray(parsed.suggestedActions) && parsed.suggestedActions.length > 0 ? parsed.suggestedActions : simResult.recommendation.suggestedActions,
          alternativeCropSuggestion: simResult.recommendation.alternativeCropSuggestion,
          generatedBy: modelName,
        },
        deepExplanation: parsed.deepExplanation || simResult.explanation,
      };
    } catch {
      // If candidate model experiences temporary congestion/503, try next candidate
      continue;
    }
  }

  // Graceful fallback to verified local agronomic ML engine
  return null;
}
