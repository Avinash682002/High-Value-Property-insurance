
import React, { useState } from 'react';
import { Guideline } from '../../types';
import { DEPARTMENTS } from '../../constants';

interface KnowledgeBaseProps {
  guidelines: Guideline[];
  onUpdateGuidelines: (guidelines: Guideline[]) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ guidelines, onUpdateGuidelines }) => {
  const [showModal, setShowModal] = useState(false);
  const [viewingGuideline, setViewingGuideline] = useState<Guideline | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    content: '', 
    version: '1.0.0', 
    department: DEPARTMENTS[0], 
    effectiveDate: new Date().toISOString().split('T')[0] 
  });

  const toggleGuideline = (id: string) => {
    onUpdateGuidelines(guidelines.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newG: Guideline = {
      id: `g-${Date.now()}`,
      name: formData.name,
      content: formData.content,
      version: formData.version,
      department: formData.department,
      effectiveDate: formData.effectiveDate,
      isActive: true,
      uploadedAt: new Date().toISOString()
    };
    onUpdateGuidelines([...guidelines, newG]);
    setShowModal(false);
    setFormData({ 
      name: '', 
      content: '', 
      version: '1.0.0', 
      department: DEPARTMENTS[0], 
      effectiveDate: new Date().toISOString().split('T')[0] 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500 text-sm">Active guidelines are automatically used by the AI Reasoning Engine</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          Upload Guidelines
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guidelines.map(g => (
          <div key={g.id} className={`bg-white rounded-xl border transition p-6 flex flex-col ${g.isActive ? 'border-indigo-500 ring-2 ring-indigo-50 shadow-sm' : 'border-slate-200 opacity-70'}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                v{g.version}
              </span>
              <button 
                onClick={() => toggleGuideline(g.id)}
                className={`text-[10px] font-bold px-2 py-1 rounded transition ${g.isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}
              >
                {g.isActive ? 'ACTIVE' : 'INACTIVE'}
              </button>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{g.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{g.department} • Effective {g.effectiveDate}</p>
            <p className="text-sm text-slate-600 mb-6 flex-grow line-clamp-3">
              {g.content}
            </p>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
              <span>{new Date(g.uploadedAt).toLocaleDateString()}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setViewingGuideline(g);
                }}
                className="text-indigo-600 hover:underline font-bold"
              >
                View Source
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6">Upload Underwriting Guidelines</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Guideline Title</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Version</label>
                  <input type="text" value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Extracted Logic / Content</label>
                <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 font-medium hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">Index Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Source Modal */}
      {viewingGuideline && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[110] p-6" onClick={() => setViewingGuideline(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full mb-3 inline-block">
                  Authorized Source Viewer
                </span>
                <h2 className="text-2xl font-black text-slate-900">{viewingGuideline.name}</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {viewingGuideline.department} • Version {viewingGuideline.version} • Effective {viewingGuideline.effectiveDate}
                </p>
              </div>
              <button 
                onClick={() => setViewingGuideline(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-slate-50 flex-grow">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2">
                  <i className="fa-solid fa-code text-indigo-500"></i> Governance Logic Content
                </h4>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {viewingGuideline.content}
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">System Index Date</p>
                  <p className="text-sm font-bold text-slate-900">{new Date(viewingGuideline.uploadedAt).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Reasoning Status</p>
                  <p className={`text-sm font-bold flex items-center gap-2 ${viewingGuideline.isActive ? 'text-green-600' : 'text-slate-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${viewingGuideline.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {viewingGuideline.isActive ? 'Actively Referenced' : 'Paused / Inactive'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setViewingGuideline(null)}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
              >
                Close Secure Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
