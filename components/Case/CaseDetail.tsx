
import React, { useState, useEffect } from 'react';
import { PropertyCase, Guideline, User, UserRole, CaseStatus } from '../../types';
import { analyzePropertyCase } from '../../services/geminiService';

interface CaseDetailProps {
  propertyCase: PropertyCase;
  guidelines: Guideline[];
  user: User;
  onUpdate: (c: PropertyCase) => void;
  onBack: () => void;
}

const CaseDetail: React.FC<CaseDetailProps> = ({ propertyCase, guidelines, user, onUpdate, onBack }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(0);
  const [notes, setNotes] = useState(propertyCase.humanNotes || '');
  const [mapLayer, setMapLayer] = useState<'satellite' | 'street'>('satellite');

  const statusMessages = [
    "Synchronizing with Orbital Feeds...",
    "Executing Structural Roof Scan...",
    "Measuring Fire Protection Latency...",
    "Detecting Industrial Hazard Buffers...",
    "Generating Strategic Decision Dossier..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisStatus(prev => (prev < statusMessages.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleExecuteAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzePropertyCase(propertyCase, guidelines);
      let finalStatus = CaseStatus.AI_PROCESSED;
      if (analysis.hazardScore >= 72) finalStatus = CaseStatus.AUTO_FLAGGED;
      onUpdate({ ...propertyCase, analysis, status: finalStatus });
    } catch (error: any) {
      console.error("Analysis execution failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMapUrl = () => {
    const address = encodeURIComponent(propertyCase.location || '');
    const type = mapLayer === 'satellite' ? 'k' : 'm';
    return `https://maps.google.com/maps?q=${address}&t=${type}&z=19&ie=UTF8&iwloc=&output=embed`;
  };

  const analysis = propertyCase.analysis;
  const isUnderwriter = user.role === UserRole.UNDERWRITER || user.role === UserRole.ADMIN_MANAGER;

  const Tooltip = ({ term, explanation }: { term: string; explanation: string }) => (
    <span className="group relative cursor-help border-b border-dotted border-slate-400">
      {term}
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-[10px] font-medium leading-relaxed text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 z-50">
        {explanation}
        <svg className="absolute top-full left-1/2 -mt-1 -ml-2 text-slate-900" width="16" height="8" viewBox="0 0 16 8" fill="currentColor">
          <path d="M0 0l8 8 8-8z" />
        </svg>
      </span>
    </span>
  );

  const MetricCard = ({ label, value, tooltip, color = "indigo" }: { label: string; value: number; tooltip: string; color?: string }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <Tooltip term={label} explanation={tooltip} />
        </span>
        <span className={`text-sm font-black text-${color}-600`}>{value.toFixed(0)}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color}-500 transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-48 bg-white rounded-[4rem] shadow-2xl border border-slate-100 max-w-4xl mx-auto text-center animate-in zoom-in duration-500">
        <div className="w-32 h-32 mb-12 relative">
          <div className="absolute inset-0 border-[8px] border-slate-50 rounded-full"></div>
          <div className="absolute inset-0 border-[8px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
            <i className="fa-solid fa-satellite-dish text-4xl animate-pulse"></i>
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-none">{statusMessages[analysisStatus]}</h2>
        <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px]">Strategic Asset Verification Active</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all bg-white shadow-md">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">{propertyCase.propertyType}</h1>
              <span className={`text-[9px] font-black px-4 py-1.5 rounded-full text-white uppercase tracking-[0.2em] ${propertyCase.status === CaseStatus.AUTO_FLAGGED ? 'bg-rose-500' :
                  propertyCase.status === CaseStatus.APPROVED ? 'bg-emerald-500' : 'bg-slate-900'
                }`}>
                {propertyCase.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-tight">
              <i className="fa-solid fa-location-dot mr-2 text-indigo-600"></i> {propertyCase.location}
            </p>
          </div>
        </div>

        {analysis && (
          <div className="flex items-center gap-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Value</p>
              <div className="text-2xl font-black text-slate-900 tracking-tighter">${(analysis.verification?.reconciledValue ? analysis.verification.reconciledValue / 1000000 : propertyCase.value / 1000000).toFixed(2)}M</div>
            </div>
            <div className="w-[1px] h-10 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hazard Index</p>
              <div className={`text-2xl font-black ${analysis.hazardScore >= 72 ? 'text-rose-600' : 'text-emerald-600'}`}>{analysis.hazardScore}</div>
            </div>
          </div>
        )}
      </div>

      {!analysis ? (
        <div className="bg-slate-900 rounded-[3.5rem] p-20 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90"></div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/20">
              <i className="fa-solid fa-satellite text-3xl text-indigo-300"></i>
            </div>
            <h2 className="text-5xl font-black mb-6 tracking-tighter uppercase leading-none">Engage AI Audit</h2>
            <p className="text-indigo-200 mb-12 text-lg font-medium leading-relaxed">
              Unlock deep geospatial intelligence, structural verification, and comprehensive risk scoring for this high-value asset.
            </p>
            <button
              onClick={handleExecuteAnalysis}
              className="bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
            >
              Start Verification
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN: VISUALS & CORE SCORES */}
          <div className="lg:col-span-8 space-y-10">

            {/* TACTICAL MAP PANEL */}
            <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
              <div className="p-6 flex justify-between items-center bg-slate-900/50 backdrop-blur-md absolute top-0 left-0 right-0 z-20 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Live Aerial Feed</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl">
                  <button onClick={() => setMapLayer('satellite')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${mapLayer === 'satellite' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Satellite</button>
                  <button onClick={() => setMapLayer('street')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${mapLayer === 'street' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Map</button>
                </div>
              </div>

              <div className="aspect-[21/9] relative bg-slate-950">
                {/* HUD Overlay Elements */}
                <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-indigo-500/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                </div>

                <iframe
                  width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                  src={getMapUrl()}
                  allowFullScreen loading="lazy"
                  className="grayscale-[20%] contrast-[1.2] brightness-[0.9]"
                ></iframe>
              </div>

              {/* AERIAL HUD DATA */}
              <div className="grid grid-cols-3 divide-x divide-white/5 bg-slate-950 p-8">
                <div className="px-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Fire Response</p>
                  <p className="text-lg font-black text-white">{analysis.mapsAudit?.fireStationDistance || 'Pending'}</p>
                </div>
                <div className="px-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Hydrant Access</p>
                  <p className="text-lg font-black text-white">{analysis.mapsAudit?.hydrantDistance || 'Pending'}</p>
                </div>
                <div className="px-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Structural Condition</p>
                  <p className="text-lg font-black text-emerald-400">{analysis.visualAudit?.conditionScore ? analysis.visualAudit.conditionScore + '%' : 'Verified'}</p>
                </div>
              </div>
            </div>

            {/* RELIABILITY & INTEGRITY SECTION */}
            <section>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6 px-2 flex items-center gap-3">
                <i className="fa-solid fa-shield-halved text-indigo-600"></i> Reliability & Integrity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  label="Confidence Score"
                  value={(analysis.confidenceScore || 0)}
                  tooltip="The AI's internal certainty level regarding this risk assessment based on available data consistency."
                />
                <MetricCard
                  label="Data Quality"
                  value={(analysis.dataQualityScore || 0)}
                  tooltip="Measures the completeness, recency, and source reliability of the property data points ingested."
                  color="emerald"
                />
                <MetricCard
                  label="Risk Consistency"
                  value={100 - (analysis.riskScore || 0)}
                  tooltip="Reflects how closely the risk profile matches standard established underwriting guidelines."
                  color="slate"
                />
              </div>
            </section>

            {/* DETAILED INSIGHT GROUPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Financial Verification */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">
                  Financial Reconciliation
                </h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-500"></i> Verified Market Value
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{analysis.verification?.marketInsight || 'Value reconciled via local market benchmarks.'}</p>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">County Match</span>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${analysis.verification?.countyValueMatch ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {analysis.verification?.countyValueMatch ? 'Confirmed' : 'Deviation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Audit */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">
                  Visual & Feature Scan
                </h4>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {(analysis.visualAudit?.detectedFeatures || ['Standard Assets']).map((f, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[9px] font-black uppercase tracking-wider">{f}</span>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-600 italic border-l-2 border-indigo-200 pl-4 py-1">
                    "{analysis.visualAudit?.zillowGalleryInsights || 'Visual gallery scan complete.'}"
                  </p>
                </div>
              </div>
            </div>

            {/* AI REASONING PANEL */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 p-10 opacity-5">
                <i className="fa-solid fa-brain text-9xl"></i>
              </div>
              <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-8">Executive Decision Summary</h3>
              <p className="text-xl font-medium leading-relaxed mb-8 text-indigo-100 italic">"{analysis.summary || 'Underwriting analysis complete.'}"</p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-microchip text-indigo-400"></i> AI Underwriting Path
                </p>
                <p className="text-xs leading-relaxed text-slate-300 font-medium">{analysis.aiReasoning || 'Deep learning logic applied to geospatial and financial datasets.'}</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SCORECARD & DECISIONS */}
          <div className="lg:col-span-4 space-y-10">

            {/* AGGREGATED SCORECARD */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100">
                <div
                  className={`h-full transition-all duration-1000 ${analysis.hazardScore >= 72 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(analysis.hazardScore || 0, 100)}%` }}
                />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 flex items-center justify-center gap-2">
                Unified Hazard Score <Tooltip term="" explanation="Aggregated risk index combining structural, geospatial, and historical hazard data." />
              </h3>
              <div className="mb-8">
                <p className={`text-8xl font-black tracking-tighter ${analysis.hazardScore >= 72 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {analysis.hazardScore || 0}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">System Verdict</p>
              </div>

              <div className={`p-8 rounded-3xl text-center border shadow-lg ${analysis.hazardScore >= 72 ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}>
                <i className={`fa-solid ${analysis.hazardScore >= 72 ? 'fa-triangle-exclamation' : 'fa-circle-check'} text-4xl mb-4`}></i>
                <p className="font-black uppercase tracking-widest text-[11px] leading-tight">
                  {analysis.hazardScore >= 72 ? 'High Risk Exposure: Human Review Mandatory' : 'Low Hazard Profile: Eligible for Fast-Bind'}
                </p>
              </div>
            </div>

            {/* RISK RADAR */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8">Risk Radar</h3>
              <div className="space-y-4">
                {(analysis.redFlags || []).length > 0 ? (
                  analysis.redFlags?.map((flag, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <i className="fa-solid fa-bolt-lightning text-rose-500 mt-1"></i>
                      <p className="text-[11px] font-bold text-rose-900 leading-relaxed uppercase">{flag}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <i className="fa-solid fa-shield-check text-emerald-500 text-3xl mb-3"></i>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No critical red flags detected</p>
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            {isUnderwriter && propertyCase.status !== CaseStatus.APPROVED && (
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8">
                <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">Binding Authority</h3>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/30 transition resize-none h-40 text-sm font-medium placeholder:text-slate-600"
                  placeholder="Record binding rationale..."
                />
                <div className="space-y-4">
                  <button
                    onClick={() => onUpdate({ ...propertyCase, status: CaseStatus.APPROVED, humanNotes: notes })}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition shadow-xl shadow-indigo-600/30 active:scale-95"
                  >
                    Bind Asset
                  </button>
                  <button
                    onClick={() => onUpdate({ ...propertyCase, status: CaseStatus.REJECTED, humanNotes: notes })}
                    className="w-full py-6 bg-white/10 hover:bg-rose-600 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition active:scale-95"
                  >
                    Decline Asset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetail;
