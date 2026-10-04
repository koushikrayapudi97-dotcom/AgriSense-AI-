import React from 'react';
import { SimulationRecord, SimulationInput } from '../types/index.js';
import { 
  Sprout, 
  TrendingUp, 
  CircleDollarSign, 
  ShieldAlert, 
  Plus, 
  ArrowRight, 
  History, 
  Clock, 
  Calendar,
  Sparkles,
  Sliders
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios.js';

interface DashboardPageProps {
  simulations: SimulationRecord[];
  onStartNewSimulation: () => void;
  onViewSimulation: (record: SimulationRecord) => void;
  onLoadDemo: (input: SimulationInput) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  simulations,
  onStartNewSimulation,
  onViewSimulation,
  onLoadDemo,
}) => {
  // Compute analytics
  const totalCount = simulations.length;
  const latestSim = simulations[0];

  // Best crop computation
  const cropProfits: Record<string, { totalProfit: number; count: number }> = {};
  simulations.forEach(s => {
    const crop = s.crop;
    if (!cropProfits[crop]) cropProfits[crop] = { totalProfit: 0, count: 0 };
    cropProfits[crop].totalProfit += s.expectedProfit;
    cropProfits[crop].count += 1;
  });

  let bestCropName = 'Rice';
  let bestCropAvgProfit = 0;
  Object.keys(cropProfits).forEach(crop => {
    const avg = cropProfits[crop].totalProfit / cropProfits[crop].count;
    if (avg > bestCropAvgProfit) {
      bestCropAvgProfit = avg;
      bestCropName = crop;
    }
  });

  const avgProfit = totalCount > 0 
    ? Math.round(simulations.reduce((acc, s) => acc + s.expectedProfit, 0) / totalCount)
    : (latestSim ? latestSim.expectedProfit : 32500);

  const avgRisk = totalCount > 0
    ? Math.round(simulations.reduce((acc, s) => acc + s.riskScore, 0) / totalCount)
    : (latestSim ? latestSim.riskScore : 42);

  return (
    <div className="space-y-8 py-4 sm:py-6" id="dashboard-page-container">
      {/* Top Banner & Primary Action */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm Decision Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time summary of multi-scenario simulations, risk exposures, and crop yield forecasting.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="btn-dashboard-start-simulation"
            onClick={onStartNewSimulation}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Simulation</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metrics-grid">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Simulations</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">{totalCount}</div>
            <p className="text-xs text-slate-500 mt-1">Saved farm scenario models</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Performing Crop</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">{bestCropName}</div>
            <p className="text-xs text-slate-500 mt-1">Highest simulated net margin</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Expected Profit</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{avgProfit.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-500 mt-1">Per simulated harvest cycle</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Avg Risk</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {avgRisk} <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {avgRisk <= 30 ? 'Low Risk Profile' : avgRisk <= 60 ? 'Moderate Risk Profile' : 'Elevated Stress Exposure'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Simulations Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden" id="recent-simulations-card">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recent Farm Simulations</h2>
            <p className="text-xs text-slate-500">History of analyzed weather and pricing parameters</p>
          </div>

          <button
            onClick={onStartNewSimulation}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>Simulate Another Crop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {simulations.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <div className="max-w-sm mx-auto">
              <h3 className="text-sm font-bold text-slate-900">No simulations recorded yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Run your first farm decision simulation or load a predefined hackathon demo scenario.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={onStartNewSimulation}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
              >
                Run First Simulation
              </button>
              <button
                onClick={() => onLoadDemo(DEMO_SCENARIOS[0].input)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Load Water Demo
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Crop & Area</th>
                  <th className="py-3 px-3">Rainfall / Temp</th>
                  <th className="py-3 px-3 text-right">Predicted Yield</th>
                  <th className="py-3 px-3 text-right">Expected Profit</th>
                  <th className="py-3 px-3 text-center">Risk Score</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {simulations.slice(0, 5).map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {record.crop.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{record.crop}</span>
                          <span className="text-[10px] text-slate-400">{record.input.farmArea} Acre(s) • {record.input.waterAvailability} Water</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600">
                      <span>{record.input.rainfall} mm</span>
                      <span className="text-[10px] text-slate-400 block">{record.input.temperature} °C</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                      {record.predictedYieldPerAcre.toLocaleString('en-IN')} kg/ac
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <span className={`font-extrabold ${record.expectedProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        ₹{record.expectedProfit.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        record.riskScore <= 30
                          ? 'bg-emerald-50 text-emerald-700'
                          : record.riskScore <= 60
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {record.riskScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                      {new Date(record.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => onViewSimulation(record)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition"
                      >
                        Inspect Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Demo Launchers */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Demo Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_SCENARIOS.map(demo => (
            <button
              key={demo.id}
              onClick={() => onLoadDemo(demo.input)}
              className="text-left p-3 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition"
            >
              <div className="text-xs font-bold text-slate-900">{demo.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{demo.tagline}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
