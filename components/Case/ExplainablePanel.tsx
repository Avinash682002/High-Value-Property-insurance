
import React from 'react';
import { CaseAnalysis } from '../../types';

interface ExplainablePanelProps { analysis: CaseAnalysis; }

const ExplainablePanel: React.FC<ExplainablePanelProps> = ({ analysis }) => {
  const isBaic = analysis.engine === 'BAIC';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className={`px-8 py-5 border-b border-slate-100 flex items-center justify-between ${isBaic ? 'bg-indigo-50/30' : 'bg-slate-50/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${isBaic ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <i className={`fa-solid ${isBaic ? 'fa-cloud-bolt' : 'fa-brain'} text-sm`}></i>
          </div>
          <h3 className="font-black text-slate-800 text-sm tracking-widest uppercase">
            {isBaic ? 'Uniphore BAIC Intelligence' : 'Gemini Core Reasoning'}
          </h3>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Engine Status</p>
            <p className={`text-xs font-black ${isBaic ? 'text-indigo-600' : 'text-slate-600'}`}>
              {isBaic ? 'ENTERPRISE AGENT' : 'SYSTEM FALLBACK'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Confidence</p>
            <p className="text-xs font-black text-indigo-600">{(analysis.confidenceScore * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>
      
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <i className="fa-solid fa-quote-left text-indigo-500"></i> Policy Cross-Reference
          </h4>
          <div className="space-y-3">
            {analysis.guidelineCitations && analysis.guidelineCitations.length > 0 ? (
              analysis.guidelineCitations.map((cite, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">{cite.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{cite.reasoning}"</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No specific guideline citations extracted for this profile.</p>
            )}
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-indigo-500"></i> Reasoning Path
            </h4>
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-sm text-indigo-900 leading-relaxed">
              {analysis.aiReasoning || "Agent did not provide a detailed reasoning trace."}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Risk Mitigation Strategy</h4>
            <div className="grid grid-cols-1 gap-2">
              {analysis.recommendations && analysis.recommendations.length > 0 ? (
                analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl text-xs font-bold text-green-700">
                    <i className="fa-solid fa-shield-halved"></i> {rec}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center p-4">Standard risk controls applied.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainablePanel;
