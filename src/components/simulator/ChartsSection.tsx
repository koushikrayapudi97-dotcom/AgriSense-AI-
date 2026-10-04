import React, { useState } from 'react';
import { SimulationResult } from '../../types/index.js';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  ReferenceDot,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  BarChart2, 
  CloudRain, 
  ShieldAlert, 
  DollarSign 
} from 'lucide-react';

interface ChartsSectionProps {
  result: SimulationResult;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ result }) => {
  const [activeChartTab, setActiveChartTab] = useState<'rainfall' | 'profit' | 'costRev' | 'risk'>('rainfall');

  // Format currency for chart tooltips
  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  // Data for Chart 2 & 3 & 4 (Scenario comparisons)
  const scenarioData = result.scenarios.map(sc => ({
    name: sc.label.split(' ')[0], // 'Optimistic', 'Expected', 'Pessimistic'
    yieldKg: sc.yieldPerAcre,
    cost: sc.totalCost,
    revenue: sc.revenue,
    profit: sc.profit,
    risk: sc.riskScore,
    roi: sc.roi,
  }));

  // Current rainfall point for Reference Dot on Rainfall Response Curve
  const currentRain = result.input.rainfall;
  const currentYield = result.predictedYieldPerAcre;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6" id="interactive-charts-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Interactive Simulation Visualizations</h3>
          <p className="text-xs text-slate-500">
            Agronomic response curves and financial sensitivity projections
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100/90 rounded-xl self-start sm:self-center" id="chart-tab-controls">
          <button
            type="button"
            id="tab-chart-rainfall"
            onClick={() => setActiveChartTab('rainfall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              activeChartTab === 'rainfall'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Yield vs Rain</span>
          </button>

          <button
            type="button"
            id="tab-chart-profit"
            onClick={() => setActiveChartTab('profit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              activeChartTab === 'profit'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Profit by Scenario</span>
          </button>

          <button
            type="button"
            id="tab-chart-cost-revenue"
            onClick={() => setActiveChartTab('costRev')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              activeChartTab === 'costRev'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Cost vs Revenue</span>
          </button>

          <button
            type="button"
            id="tab-chart-risk"
            onClick={() => setActiveChartTab('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              activeChartTab === 'risk'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risk by Scenario</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Containers */}
      <div className="h-72 sm:h-80 w-full pt-2">
        {/* CHART 1: Yield vs Rainfall */}
        {activeChartTab === 'rainfall' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={result.rainfallCurve}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="rainfall" 
                unit=" mm"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Seasonal Precipitation (mm)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#475569' }}
              />
              <YAxis 
                unit=" kg"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Yield (kg/acre)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#475569' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg">
                        <p className="font-bold text-emerald-300">Rainfall: {d.rainfall} mm</p>
                        <p className="text-slate-200 mt-0.5">Predicted Yield: <strong>{d.predictedYield} kg/acre</strong></p>
                        {d.rainfall === currentRain && (
                          <span className="inline-block mt-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                            Current Parameter
                          </span>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="predictedYield" 
                name="Yield Response" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ r: 3, fill: '#059669' }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
              <ReferenceDot
                x={currentRain}
                y={currentYield}
                r={7}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* CHART 2: Profit by Scenario */}
        {activeChartTab === 'profit' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scenarioData}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
              <YAxis 
                tickFormatter={(val) => `₹${val / 1000}k`}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Net Profit (₹)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#475569' }}
              />
              <Tooltip
                formatter={(value: any) => [formatINR(Number(value)), 'Expected Net Profit']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="profit" name="Net Profit" radius={[6, 6, 0, 0]}>
                {scenarioData.map((entry, index) => (
                  <Cell 
                    key={`profit-cell-${index}`} 
                    fill={entry.profit >= 0 ? (entry.name === 'Expected' ? '#2563eb' : '#059669') : '#e11d48'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* CHART 3: Cost vs Revenue */}
        {activeChartTab === 'costRev' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scenarioData}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
              <YAxis 
                tickFormatter={(val) => `₹${val / 1000}k`}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                formatter={(value: any, name: any) => [formatINR(Number(value)), name === 'cost' ? 'Total Cost' : 'Gross Revenue']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="cost" name="Total Cost" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Gross Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* CHART 4: Risk by Scenario */}
        {activeChartTab === 'risk' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scenarioData}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
              <YAxis 
                domain={[0, 100]}
                unit="/100"
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{ value: 'Risk Index (0-100)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#475569' }}
              />
              <Tooltip
                formatter={(value: any) => [`${value} / 100`, 'Risk Index']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="risk" name="Risk Score" radius={[6, 6, 0, 0]}>
                {scenarioData.map((entry, index) => {
                  let barFill = '#10b981';
                  if (entry.risk > 60) barFill = '#f97316';
                  if (entry.risk > 80) barFill = '#e11d48';
                  else if (entry.risk > 30) barFill = '#f59e0b';
                  return <Cell key={`risk-cell-${index}`} fill={barFill} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
