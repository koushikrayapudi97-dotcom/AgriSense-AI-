import React from 'react';
import { DecisionTimelineEvent } from '../../types/index.js';
import { History, CheckCircle2, RefreshCw, ArrowRightLeft, Clock } from 'lucide-react';

interface DecisionTimelineProps {
  events: DecisionTimelineEvent[];
}

export const DecisionTimeline: React.FC<DecisionTimelineProps> = ({ events }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5" id="decision-timeline-section">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Decision Timeline & Planning History
          </h3>
          <p className="text-xs text-slate-500">
            Audit trail of farm parameters, condition shifts, and adaptive re-evaluations.
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((evt) => {
          const isBaseline = evt.type === 'INITIAL_BASELINE';
          const isShift = evt.type === 'CONDITION_SHIFT';
          const isResim = evt.type === 'RESIMULATION';

          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Dot */}
              <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                isBaseline ? 'bg-emerald-600' : isShift ? 'bg-amber-500' : 'bg-blue-600'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Event Content Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 hover:border-slate-300 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      Round {evt.round}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      {evt.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {evt.description}
                </p>

                {evt.metrics && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60 text-[11px] font-medium text-slate-700">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      Crop: <strong className="text-slate-900">{evt.metrics.crop}</strong>
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      Profit: <strong className="text-emerald-700">₹{evt.metrics.profit.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                      Risk: <strong className="text-slate-900">{evt.metrics.riskScore}/100</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
