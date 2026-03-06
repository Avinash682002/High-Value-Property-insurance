
import React, { useState } from 'react';
import { PropertyCase, CaseStatus } from '../../types';

interface UnderwriterDashboardProps {
  cases: PropertyCase[];
  onViewCase: (id: string) => void;
  onDeleteCase: (id: string) => void;
}

const UnderwriterDashboard: React.FC<UnderwriterDashboardProps> = ({ cases = [], onViewCase, onDeleteCase }) => {
  const [filter, setFilter] = useState<'pending' | 'ready' | 'flagged'>('ready');

  const filteredCases = cases.filter(c => {
    if (filter === 'pending') return c.status === CaseStatus.PENDING_ANALYSIS;
    if (filter === 'ready') return c.status === CaseStatus.AI_PROCESSED || c.status === CaseStatus.HUMAN_REVIEWED;
    if (filter === 'flagged') return c.status === CaseStatus.AUTO_FLAGGED;
    return false;
  });

  const stats = [
    { label: 'Priority Triage', count: cases.filter(c => c.status === CaseStatus.AUTO_FLAGGED).length, color: 'text-rose-600' },
    { label: 'AI Validated', count: cases.filter(c => c.status === CaseStatus.AI_PROCESSED).length, color: 'text-indigo-600' },
    { label: 'Avg. Scan Time', count: '4.2s', color: 'text-emerald-600' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Underwriter <br /> <span className="text-indigo-600">Command Center</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Managing {cases.length} Unified Risk Dossiers</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{s.label}</p>
              <p className={`text-3xl font-black tracking-tighter ${s.color}`}>{s.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm w-fit">
        {[
          { id: 'pending', label: 'Queued Assets', icon: 'fa-layer-group' },
          { id: 'ready', label: 'AI Analysis Ready', icon: 'fa-wand-magic-sparkles' },
          { id: 'flagged', label: 'Critical Flags', icon: 'fa-triangle-exclamation' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${filter === f.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'
              }`}
          >
            <i className={`fa-solid ${f.icon}`}></i>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Risk Profile</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Location & Asset</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Hazard Score</th>
                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Triage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="opacity-10 mb-6">
                      <i className="fa-solid fa-inbox text-7xl"></i>
                    </div>
                    <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm">Clear Horizon • No Tasks in Queue</p>
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => onViewCase(c.id)}>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${c.status === CaseStatus.AUTO_FLAGGED ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'
                          }`}>
                          <i className={`fa-solid ${c.status === CaseStatus.AUTO_FLAGGED ? 'fa-bolt-lightning' : 'fa-check-double'}`}></i>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 uppercase tracking-tight">{c.propertyType}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: {c.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <p className="font-bold text-slate-900 truncate max-w-xs">{c.location}</p>
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Valuation: ${(c.value / 1000000).toFixed(1)}M</p>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-2xl font-black tracking-tighter ${(c.analysis?.hazardScore || 0) >= 72 ? 'text-rose-600' : 'text-emerald-600'
                          }`}>
                          {c.analysis?.hazardScore || '--'}
                        </span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${(c.analysis?.hazardScore || 0) >= 72 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(c.analysis?.hazardScore || 0, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] group-hover:bg-indigo-600 transition-all">
                          Deep Review
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteCase(c.id); }}
                          className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-sm shadow-sm"
                          title="Delete Case"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UnderwriterDashboard;
