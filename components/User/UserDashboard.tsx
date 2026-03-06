
import React from 'react';
import { PropertyCase, CaseStatus } from '../../types';

interface UserDashboardProps {
  cases: PropertyCase[];
  onCreateCase: () => void;
  onViewCase: (id: string) => void;
  onDeleteCase: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ cases, onCreateCase, onViewCase, onDeleteCase }) => {
  const portfolioValue = cases.reduce((acc, c) => acc + c.value, 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Portfolio Stats Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-indigo-600 rounded-[3.5rem] p-12 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 p-12 opacity-10 pointer-events-none">
            <i className="fa-solid fa-briefcase text-[12rem]"></i>
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-200 mb-4">Total Portfolio Underwriting</p>
            <div className="flex items-end gap-6 mb-10">
              <h2 className="text-7xl font-black tracking-tighter leading-none">${(portfolioValue / 1000000).toFixed(1)}<span className="text-2xl text-indigo-300 ml-2">M</span></h2>
              <div className="mb-2">
                <span className="text-xs font-bold text-indigo-200 flex items-center gap-2">
                  <i className="fa-solid fa-arrow-trend-up"></i> +12.4% vs last month
                </span>
              </div>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300 mb-1">Active Bindings</p>
                <p className="text-2xl font-black">{cases.filter(c => c.status === CaseStatus.APPROVED).length}</p>
              </div>
              <div className="w-[1px] h-10 bg-white/10"></div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300 mb-1">Awaiting AI Sync</p>
                <p className="text-2xl font-black">{cases.filter(c => c.status === CaseStatus.PENDING_ANALYSIS).length}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onCreateCase}
          className="bg-white border-4 border-dashed border-slate-200 rounded-[3.5rem] p-12 flex flex-col items-center justify-center text-center group hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-500"
        >
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform shadow-2xl">
            <i className="fa-solid fa-plus"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">New Asset <br /> Intake</h3>
          <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-[0.2em]">Start Unified Scan</p>
        </button>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Active <span className="text-indigo-600">Dossiers</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Managing {cases.length} Property Submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cases.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-white rounded-[3.5rem] border border-slate-100">
            <i className="fa-solid fa-folder-open text-6xl text-slate-100 mb-8"></i>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">No Active Portfolio</h3>
            <p className="text-slate-400 mt-4 font-medium">Your underwriting cases will appear here once initiated.</p>
          </div>
        ) : (
          cases.map(c => (
            <div
              key={c.id}
              onClick={() => onViewCase(c.id)}
              className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${c.status === CaseStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' :
                    c.status === CaseStatus.REJECTED ? 'bg-rose-50 text-rose-600' :
                      'bg-indigo-50 text-indigo-600'
                  }`}>
                  <i className="fa-solid fa-building-circle-check"></i>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${c.status === CaseStatus.APPROVED ? 'bg-emerald-500 text-white' :
                      c.status === CaseStatus.REJECTED ? 'bg-rose-500 text-white' :
                        'bg-slate-900 text-white'
                    }`}>
                    {c.status.replace('_', ' ')}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteCase(c.id); }}
                    className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center text-xs"
                    title="Delete Case"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div className="mb-10 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition mb-2 uppercase">{c.propertyType}</h3>
                <p className="text-slate-500 text-sm font-bold truncate"><i className="fa-solid fa-location-dot mr-2 text-indigo-400"></i> {c.location}</p>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Asset Value</p>
                  <p className="font-black text-slate-900 text-xl tracking-tighter">${(c.value / 1000000).toFixed(1)}M</p>
                </div>
                {c.analysis && (
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Hazard Score</p>
                    <p className={`font-black text-2xl tracking-tighter ${c.analysis.hazardScore >= 72 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {c.analysis.hazardScore}
                    </p>
                  </div>
                )}
              </div>

              {/* Decorative Subtle Icon */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-[8rem] group-hover:scale-110 group-hover:opacity-[0.05] transition-all">
                <i className="fa-solid fa-city"></i>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
