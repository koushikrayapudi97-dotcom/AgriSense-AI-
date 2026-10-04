import React from 'react';
import { FeatureImportanceItem } from '../../types/index.js';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { BarChart3, Info } from 'lucide-react';

interface FactorImportanceChartProps {
  featureImportance: FeatureImportanceItem[];
}

export const FactorImportanceChart: React.FC<FactorImportanceChartProps> = ({
  featureImportance,
}) => {
  // Sort descending by importance
  const data = [...featureImportance].sort((a, b) => b.importance - a.importance);
  const colors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#93c5fd', '#c7d2fe'];
  const topFactor = data[0] || { feature: 'Rainfall', importance: 34, description: 'Precipitation volume and distribution' };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" id="factor-analysis-card">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Yield Influencers
            </div>
            <h3 className="text-base font-bold text-slate-900">What Influences Your Result?</h3>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Random Forest Splits
          </span>
        </div>

        {/* Bento Progress Bars for Top Influencers */}
        <div className="space-y-3 mb-5">
          {data.slice(0, 4).map((item, idx) => (
            <div key={item.feature}>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700 font-semibold">{item.feature}</span>
                <span className="text-emerald-600 font-bold">{item.importance}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, Math.max(5, item.importance * 2.2))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Chart View */}
        <div className="h-44 sm:h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 2, right: 20, left: 30, bottom: 2 }}
            >
              <XAxis 
                type="number" 
                domain={[0, 45]} 
                unit="%" 
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <YAxis 
                dataKey="feature" 
                type="category" 
                width={110}
                tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as FeatureImportanceItem;
                    return (
                      <div className="bg-[#064e3b] text-white p-2.5 rounded-lg text-xs shadow-lg max-w-xs border border-emerald-600">
                        <p className="font-bold text-emerald-300">{item.feature}: {item.importance}%</p>
                        <p className="text-emerald-100/90 text-[11px] mt-1">{item.description}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Confidence & Takeaway footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>Top driver: <strong className="text-slate-700 font-semibold">{topFactor.feature} ({topFactor.importance}%)</strong></span>
        </span>
        <span className="text-slate-700 font-bold">Confidence: 94.2%</span>
      </div>
    </div>
  );
};
