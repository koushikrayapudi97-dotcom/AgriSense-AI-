import fs from 'fs';
import path from 'path';
import { SimulationRecord, SimulationResult, SimulationInput } from '../../src/types/index.js';
import { runAgriculturalSimulation } from '../ml/model.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'simulations.json');

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seedRecords: SimulationRecord[] = generateSeedRecords();
    fs.writeFileSync(DB_FILE, JSON.stringify(seedRecords, null, 2), 'utf-8');
  }
}

function generateSeedRecords(): SimulationRecord[] {
  const seedInputs: Array<{ input: SimulationInput; title: string; daysAgo: number }> = [
    {
      title: 'Rice Kharif Season Baseline - High Rainfall',
      daysAgo: 2,
      input: {
        crop: 'Rice',
        farmArea: 5,
        rainfall: 1200,
        temperature: 30,
        waterAvailability: 'High',
        fertilizerUsage: 'High',
        productionCost: 38000,
        expectedMarketPrice: 28,
        autoPredictYield: true,
      },
    },
    {
      title: 'Maize Alternative Trial - Moderate Water',
      daysAgo: 5,
      input: {
        crop: 'Maize',
        farmArea: 10,
        rainfall: 680,
        temperature: 28,
        waterAvailability: 'Medium',
        fertilizerUsage: 'Medium',
        productionCost: 24000,
        expectedMarketPrice: 23,
        autoPredictYield: true,
      },
    },
    {
      title: 'Cotton Commercial Crop - Price Volatility Test',
      daysAgo: 9,
      input: {
        crop: 'Cotton',
        farmArea: 8,
        rainfall: 850,
        temperature: 33,
        waterAvailability: 'Medium',
        fertilizerUsage: 'Medium',
        productionCost: 42000,
        expectedMarketPrice: 70,
        autoPredictYield: true,
      },
    },
    {
      title: 'Millet Arid Climate Stress Simulation',
      daysAgo: 14,
      input: {
        crop: 'Millet',
        farmArea: 4,
        rainfall: 380,
        temperature: 38,
        waterAvailability: 'Low',
        fertilizerUsage: 'Low',
        productionCost: 16000,
        expectedMarketPrice: 30,
        autoPredictYield: true,
      },
    },
    {
      title: 'Groundnut Oilseed High Margin Strategy',
      daysAgo: 20,
      input: {
        crop: 'Groundnut',
        farmArea: 6,
        rainfall: 620,
        temperature: 29,
        waterAvailability: 'Medium',
        fertilizerUsage: 'Medium',
        productionCost: 26000,
        expectedMarketPrice: 65,
        autoPredictYield: true,
      },
    },
  ];

  return seedInputs.map((item, idx) => {
    const sim = runAgriculturalSimulation(item.input);
    const date = new Date(Date.now() - item.daysAgo * 86400000).toISOString();
    return {
      ...sim,
      id: `sim_seed_${idx + 1}`,
      createdAt: date,
      timestamp: date,
      title: item.title,
    };
  });
}

export class SimulationStorage {
  private static readDb(): SimulationRecord[] {
    ensureDbExists();
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading simulation database, returning empty', e);
      return [];
    }
  }

  private static writeDb(records: SimulationRecord[]): void {
    ensureDbExists();
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  }

  public static getAll(search?: string, crop?: string): SimulationRecord[] {
    let records = this.readDb();
    if (crop && crop !== 'all') {
      records = records.filter(r => r.crop.toLowerCase() === crop.toLowerCase());
    }
    if (search && search.trim() !== '') {
      const s = search.toLowerCase();
      records = records.filter(
        r =>
          r.crop.toLowerCase().includes(s) ||
          r.title?.toLowerCase().includes(s) ||
          r.riskLevel.toLowerCase().includes(s)
      );
    }
    // Sort newest first
    return records.sort((a, b) => new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime());
  }

  public static getById(id: string): SimulationRecord | null {
    const records = this.readDb();
    return records.find(r => r.id === id) || null;
  }

  public static save(result: SimulationResult, customTitle?: string): SimulationRecord {
    const records = this.readDb();
    const id = result.id || `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const title = customTitle || `${result.crop} Simulation (${result.input.farmArea} acres, ₹${result.expectedProfit.toLocaleString('en-IN')} profit)`;

    const newRecord: SimulationRecord = {
      ...result,
      id,
      createdAt: now,
      timestamp: now,
      title,
    };

    records.unshift(newRecord);
    // Keep max 100 recent simulations
    const trimmed = records.slice(0, 100);
    this.writeDb(trimmed);
    return newRecord;
  }

  public static deleteById(id: string): boolean {
    const records = this.readDb();
    const initialLen = records.length;
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length < initialLen) {
      this.writeDb(filtered);
      return true;
    }
    return false;
  }

  public static clearAll(): void {
    this.writeDb([]);
  }
}

// -------------------------------------------------------------
// Decision History Storage (Dynamic Re-Planning Chain)
// -------------------------------------------------------------
const DECISION_HISTORY_FILE = path.join(DATA_DIR, 'decision_history.json');

function ensureDecisionHistoryDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DECISION_HISTORY_FILE)) {
    const seedHistory: any[] = [
      {
        id: 'dec_seed_1',
        simulation_id: 'sim_seed_1',
        cycle_number: 1,
        crop: 'Rice',
        farm_area: 5,
        rainfall: 750,
        temperature: 30,
        water_availability: 'Medium',
        fertilizer_usage: 'Medium',
        production_cost: 35000,
        market_price: 25,
        predicted_yield: 2600,
        revenue: 72800,
        profit: 27800,
        risk_score: 35,
        risk_level: 'Moderate',
        strategy_status: 'CONTINUE',
        recommendation_headline: 'Favorable Outlook for Rice Cultivation',
        recommended_crop: 'Rice',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'dec_seed_2',
        simulation_id: 'sim_seed_1',
        parent_decision_id: 'dec_seed_1',
        cycle_number: 2,
        crop: 'Rice',
        farm_area: 5,
        rainfall: 580,
        temperature: 34,
        water_availability: 'Low',
        fertilizer_usage: 'Medium',
        production_cost: 36000,
        market_price: 25,
        predicted_yield: 2200,
        revenue: 61600,
        profit: 15600,
        risk_score: 67,
        risk_level: 'High',
        strategy_status: 'SWITCH_STRATEGY',
        recommendation_headline: 'Consider Switching from Rice to Maize',
        recommended_crop: 'Maize',
        created_at: new Date().toISOString(),
        updated_conditions: {
          rainfall: 580,
          temperature: 34,
          water_availability: 'Low',
        }
      }
    ];
    fs.writeFileSync(DECISION_HISTORY_FILE, JSON.stringify(seedHistory, null, 2), 'utf-8');
  }
}

export class DecisionHistoryStorage {
  private static readDb(): any[] {
    ensureDecisionHistoryDbExists();
    try {
      const data = fs.readFileSync(DECISION_HISTORY_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading decision history database, returning empty', e);
      return [];
    }
  }

  private static writeDb(records: any[]): void {
    ensureDecisionHistoryDbExists();
    fs.writeFileSync(DECISION_HISTORY_FILE, JSON.stringify(records, null, 2), 'utf-8');
  }

  public static getAll(): any[] {
    const list = this.readDb();
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static getBySimulationId(simId: string): any[] {
    const list = this.readDb();
    return list.filter(r => r.simulation_id === simId || r.parent_decision_id === simId);
  }

  public static save(record: any): any {
    const records = this.readDb();
    const id = record.id || `dec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      id,
      created_at: record.created_at || now,
    };
    records.unshift(newRecord);
    this.writeDb(records.slice(0, 200));
    return newRecord;
  }
}
