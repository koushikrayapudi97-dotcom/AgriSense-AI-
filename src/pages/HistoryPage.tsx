import React, { useState } from 'react';
import { SimulationRecord } from '../types/index.js';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Download, 
  Sliders, 
  Filter, 
  Calendar, 
  Sprout, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { AgriSenseApiService } from '../services/api.js';

interface HistoryPageProps {
  simulations: SimulationRecord[];
  onViewSimulation: (record: SimulationRecord) => void;
  onRefreshHistory: () => void;
  onNavigateToSimulator: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  simulations,
  onViewSimulation,
  onRefreshHistory,
  onNavigateToSimulator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredSimulations = simulations.filter(sim => {
    const matchesCrop = cropFilter === 'all' || sim.crop === cropFilter;
    const matchesSearch = 
      sim.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.notes.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this simulation from history?')) return;
    setDeletingId(id);
    await AgriSenseApiService.deleteSimulation(id);
    setDeletingId(null);
    onRefreshHistory();
  };

  const handleExportCSV = () => {
    if (simulations.length === 0) return;
    const headers = [
      'ID',
      'Crop',
      'FarmArea(Acres)',
      'Rainfall(mm)',
      'Temperature(C)',
      'WaterAvailability',
      'FertilizerUsage',
      'CostPerAcre(INR)',
      'PricePerKg(INR)',
      'PredictedYield(kg/ac)',
      'TotalYield(kg)',
      'ExpectedProfit(INR)',
      'RiskScore',
      'RiskLevel',
      'Date',
    ];

    const rows = simulations.map(s => [
      s.id,
      s.crop,
      s.input.farmArea,
      s.input.rainfall,
      s.input.temperature,
      s.input.waterAvailability,
      s.input.fertilizerUsage,
      s.input.productionCost,
      s.input.expectedMarketPrice,
      s.predictedYieldPerAcre,
      s.totalYield,
      s.expectedProfit,
      s.riskScore,
      s.riskLevel,
      new Date(s.timestamp).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AgriSense_Simulations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uniqueCrops = Array.from(new Set(simulations.map(s => s.crop)));

  return (
    <div className="py-4 sm:py-6 space-y-6" id="history-page-container">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Simulation Records & History
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {simulations.length} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Retrieve past agronomic scenarios, export CSV records, or reload parameters for re-testing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {simulations.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={onNavigateToSimulator}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>New Simulation</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by crop or notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={cropFilter}
            onChange={e => setCropFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700"
          >
            <option value="all">All Crops</option>
            {uniqueCrops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredSimulations.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No simulation records match your criteria</p>
            <p className="text-[11px] text-slate-400 mt-1">Try resetting search filters or run a new simulation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Crop</th>
                  <th className="py-3 px-3">Area</th>
                  <th className="py-3 px-3">Rainfall</th>
                  <th className="py-3 px-3">Water</th>
                  <th className="py-3 px-3 text-right">Yield</th>
                  <th className="py-3 px-3 text-right">Expected Profit</th>
                  <th className="py-3 px-3 text-center">Risk</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSimulations.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                          {record.crop.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{record.crop}</span>
                          <span className="text-[10px] text-slate-400">{record.notes}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700">
                      {record.input.farmArea} ac
                    </td>

                    <td className="py-3.5 px-3 text-slate-700">
                      {record.input.rainfall} mm
                    </td>

                    <td className="py-3.5 px-3 text-slate-700">
                      {record.input.waterAvailability}
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
                      {new Date(record.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onViewSimulation(record)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          title="Load into Simulator"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          disabled={deletingId === record.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete simulation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
