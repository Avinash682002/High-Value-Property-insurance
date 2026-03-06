
import React from 'react';
import { PropertyCase, CaseStatus, UserRole } from '../../types';

interface AdminDashboardProps {
  cases: PropertyCase[];
  onViewCase: (id: string) => void;
  onDeleteCase: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ cases = [], onViewCase, onDeleteCase }) => {
  const highRiskCount = cases.filter(c => (c.analysis?.hazardScore || 0) >= 72).length;
  const totalValue = cases.reduce((acc, c) => acc + c.value, 0);

  // High-Level ROI Logic
  const minsSavedPerCase = 30; // Based on problem statement
  const totalHoursSaved = (cases.length * minsSavedPerCase) / 60;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Governance <br /> <span className="text-indigo-600">Analytics Hub</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Global Policy & System ROI Overview</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 px-10 py-6 rounded-[2.5rem] shadow-sm text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Efficiency Gain</p>
            <p className="text-4xl font-black text-indigo-600 tracking-tighter">+{totalHoursSaved.toFixed(0)} <span className="text-sm font-bold text-slate-300">HRS</span></p>
          </div>
          <div className="bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] shadow-xl text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Asset Volume</p>
            <p className="text-4xl font-black tracking-tighter">${(totalValue / 1000000).toFixed(1)}<span className="text-sm font-bold text-slate-500">M</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'System Intake', count: cases.length, color: 'text-indigo-600', icon: 'fa-database' },
          { label: 'High Hazard Flags', count: highRiskCount, color: 'text-rose-600', icon: 'fa-radiation' },
          { label: 'Auto-Decisions', count: cases.filter(c => c.status === CaseStatus.AUTO_FLAGGED).length, color: 'text-emerald-600', icon: 'fa-robot' },
          { label: 'Pending Audit', count: cases.filter(c => c.status === CaseStatus.AI_PROCESSED).length, color: 'text-amber-600', icon: 'fa-shield-halved' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-xl text-slate-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{s.label}</p>
            <p className={`text-5xl font-black tracking-tighter ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Audit Pipeline Summary */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-12 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em]">Recent Compliance Log</h3>
          <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full">Real-time Stream</span>
        </div>
        <div className="p-12 space-y-8">
          {cases.slice(0, 5).map((c, i) => (
            <div key={i} className="flex items-center justify-between pb-8 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${c.status === CaseStatus.AUTO_FLAGGED ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                  <i className="fa-solid fa-file-shield"></i>
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-tight">{c.location}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.propertyType} • {c.userName}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{c.status.replace('_', ' ')}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Decision Date: {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteCase(c.id); }}
                  className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-xs mb-3"
                  title="Delete Case"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
