
import React, { useState } from 'react';
import { User, PropertyCase, CaseStatus, Guideline } from '../../types';
import { PROPERTY_TYPES, CONSTRUCTION_TYPES } from '../../constants';
import { fetchZillowData } from '../../services/geminiService';

interface PropertyWizardProps {
  user: User;
  guidelines: Guideline[];
  onCreate: (c: PropertyCase) => void;
  onCancel: () => void;
}

const PropertyWizard: React.FC<PropertyWizardProps> = ({ user, guidelines, onCreate, onCancel }) => {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingZillow, setIsFetchingZillow] = useState(false);
  const [formData, setFormData] = useState({
    propertyType: PROPERTY_TYPES[0],
    location: '',
    value: 0,
    yearBuilt: 0,
    constructionType: CONSTRUCTION_TYPES[0],
    sqft: 0,
    riskFactors: [] as string[],
    claimNotes: '',
    externalLinks: '',
    documents: [] as File[]
  });

  const handleZillowFetch = async () => {
    if (!formData.location || formData.location.length < 5) {
      alert("Please enter a valid property address first.");
      return;
    }
    setIsFetchingZillow(true);
    const data = await fetchZillowData(formData.location);
    if (data) {
      setFormData(prev => ({
        ...prev,
        value: data.value || prev.value,
        sqft: data.sqft || prev.sqft,
        yearBuilt: data.yearBuilt || prev.yearBuilt
      }));
    } else {
      alert("System could not verify this address via secure data pipe. Please input details manually.");
    }
    setIsFetchingZillow(false);
  };

  const applyPreset = (type: 'luxury' | 'commercial' | 'heritage' | 'hazard') => {
    switch (type) {
      case 'luxury':
        setFormData({
          ...formData,
          location: '7371 Sawgrass Point Dr, Pinellas Park, FL 33782`301 1st St S #3104, Saint Petersburg, FL 33701',
          value: 1775000,
          sqft: 4326,
          yearBuilt: 2000,
          propertyType: 'Luxury Residential',
          externalLinks: 'https://www.redfin.com/FL/Palm-Beach/4500-Ocean-Blvd-33480/home/12345',
          riskFactors: [],
          claimNotes: 'Fabulous golf course home in the prestigious country club community, the Bayou Club! Uniquely designed, Campagna-built home with four bedrooms and three full baths. Note: bedroom four is currently being used as a home office. This amazing home has an oversized three-car garage. This golf course home overlooks the 6th green of the championship, Fazio-designed Bayou Club golf course. A distinctly designed, one-story residence with 4,326 square feet of living area and an extra-large covered Lanai-patio and pool/spa area with a unique, waterfall feature. This home also has a completely updated media room you’ll love. Located on a unique corner lot with great curb appeal, mature landscaping and a circular paver driveway. Open kitchen with a dinette area opening to the family room with sunken wet bar for easy entertaining. A great opportunity, in the Bayou Club!'
        });
        break;
      case 'hazard':
        setFormData({
          ...formData,
          location: '12-B Industrial Way, Jersey City, NJ',
          value: 8500000,
          sqft: 22000,
          yearBuilt: 1985,
          propertyType: 'Industrial Facility',
          riskFactors: ['Severe foundation cracks', 'Exposed legacy wiring', 'Near chemical storage'],
          claimNotes: 'Frequent small fire incidents reported.'
        });
        break;
      case 'heritage':
        setFormData({
          ...formData,
          location: '202 Scarsdale Rd, Yonkers, NY',
          value: 2200000,
          sqft: 3800,
          yearBuilt: 1924,
          propertyType: 'Heritage / Historic Asset',
          riskFactors: ['Original wooden structural beams', 'Antique finishes'],
          claimNotes: 'Adjuster note 2023: Lower level water ingress during historic storm. Estimated $28k damage.'
        });
        break;
      case 'commercial':
        setFormData({
          ...formData,
          location: '888 Collins Ave, Miami Beach, FL',
          value: 12000000,
          sqft: 45000,
          yearBuilt: 2020,
          propertyType: 'Commercial High-Rise',
          riskFactors: ['Multiple high-end retail tenants'],
          externalLinks: 'https://www.commercialexchange.com/property/...'
        });
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 1) {
      setStep(step + 1);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newCase: PropertyCase = {
        id: `c-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        propertyType: formData.propertyType,
        location: formData.location || 'Undisclosed Asset',
        value: formData.value,
        yearBuilt: formData.yearBuilt,
        constructionType: formData.constructionType,
        sqft: formData.sqft,
        riskFactors: formData.riskFactors,
        claimNotes: formData.claimNotes,
        externalLinks: formData.externalLinks ? [formData.externalLinks] : [],
        documents: formData.documents.map(f => ({ name: f.name, type: f.type, size: (f.size / 1024).toFixed(0) + 'KB' })),
        status: CaseStatus.PENDING_ANALYSIS,
        createdAt: new Date().toISOString()
      };
      onCreate(newCase);
      setIsProcessing(false);
    }, 1000);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-2xl mx-auto text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 mb-10 relative">
          <div className="absolute inset-0 border-[6px] border-indigo-50 rounded-full"></div>
          <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
            <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Syncing Asset Dossier...</h2>
        <div className="flex items-center gap-2 justify-center">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
          <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]">Finalizing Partner Submission</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 p-10 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute -right-20 -top-20 opacity-10">
          <i className="fa-solid fa-shield-halved text-[15rem]"></i>
        </div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-indigo-600/30">
            <i className="fa-solid fa-file-signature"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight leading-none mb-1">Agent Property Intake</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-80 italic uppercase">Secure Data Connection Active</p>
          </div>
        </div>
        <button onClick={onCancel} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white/50 hover:text-white relative z-10">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <div className="p-10">
        <div className="mb-10 bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 flex flex-wrap gap-4 items-center justify-center">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mr-2">Quick Presets:</span>
          {[
            { id: 'luxury', label: 'Luxury Home', icon: 'fa-gem' },
            { id: 'hazard', label: 'High Hazard', icon: 'fa-biohazard' },
            { id: 'heritage', label: 'Heritage Asset', icon: 'fa-landmark' },
            { id: 'commercial', label: 'Commercial', icon: 'fa-city' }
          ].map(p => (
            <button key={p.id} type="button" onClick={() => applyPreset(p.id as any)} className="px-4 py-2 bg-white border border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-sm">
              <i className={`fa-solid ${p.icon} mr-2`}></i> {p.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {step === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 ml-1">Asset Location</label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Physical Address..."
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-6 py-4 pr-32 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleZillowFetch}
                      disabled={isFetchingZillow || !formData.location}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isFetchingZillow ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-lock-open"></i>
                      )}
                      {isFetchingZillow ? 'Verifying...' : 'Secure Verify'}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold ml-1">Verifying via Bridge/Estated Authorized Data Pipe.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 ml-1">Estimated Market Value ($)</label>
                  <input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-black text-lg" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 ml-1">Verified Sqft</label>
                  <input type="number" value={formData.sqft} onChange={e => setFormData({ ...formData, sqft: Number(e.target.value) })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 ml-1">Year Built</label>
                  <input type="number" value={formData.yearBuilt} onChange={e => setFormData({ ...formData, yearBuilt: Number(e.target.value) })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 ml-1">Property Category</label>
                  <select value={formData.propertyType} onChange={e => setFormData({ ...formData, propertyType: e.target.value })} className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-bold">
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 ml-1">Claims Chronology / Adjuster Notes</label>
                <textarea rows={4} placeholder="Paste raw notes for underwriting review..." value={formData.claimNotes} onChange={e => setFormData({ ...formData, claimNotes: e.target.value })} className="w-full px-6 py-4 rounded-[2rem] border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-medium text-sm leading-relaxed resize-none" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1 ml-1">Risk Observations</label>
                <input type="text" placeholder="Add factors like 'Cracked Foundation', 'New Roof 2024'..." onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val && !formData.riskFactors.includes(val)) {
                      setFormData({ ...formData, riskFactors: [...formData.riskFactors, val] });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }} className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-medium" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.riskFactors.map((rf, i) => (
                    <span key={i} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 animate-in zoom-in">
                      {rf}
                      <button type="button" onClick={() => setFormData({ ...formData, riskFactors: formData.riskFactors.filter((_, idx) => idx !== i) })}><i className="fa-solid fa-xmark"></i></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="p-16 border-[5px] border-dashed border-slate-50 rounded-[3rem] text-center bg-slate-50/50 group hover:border-indigo-100 hover:bg-white transition-all duration-300">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-sm group-hover:text-indigo-600 group-hover:shadow-xl group-hover:-translate-y-2 transition-all">
                  <i className="fa-solid fa-camera-retro text-4xl"></i>
                </div>
                <p className="font-black text-slate-800 text-xl mb-2">Ingest Visual Assets</p>
                <p className="text-[10px] text-slate-400 mb-10 uppercase tracking-[0.4em] font-black">Photos for Underwriter Analysis</p>
                <input type="file" multiple className="hidden" id="wizard-file" onChange={e => setFormData({ ...formData, documents: [...formData.documents, ...Array.from(e.target.files || [])] })} />
                <button type="button" onClick={() => document.getElementById('wizard-file')?.click()} className="bg-slate-900 text-white px-10 py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95">Browse Files</button>
                {formData.documents.length > 0 && (
                  <div className="mt-8 flex justify-center gap-2 flex-wrap">
                    {formData.documents.map((d, i) => (
                      <span key={i} className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-[9px] font-black uppercase text-indigo-600">{d.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-5 pt-12 border-t border-slate-50">
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-5 border-2 border-slate-100 rounded-2xl font-black text-slate-400 uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">Back</button>
            )}
            <button type="submit" className={`flex-[3] py-5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-[0.98] ${step === 1 ? 'bg-indigo-600 shadow-indigo-600/30' : 'bg-slate-900 shadow-slate-900/30'}`}>
              {step === 1 ? 'Complete Partner Submission' : 'Next: Upload Visual Assets'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyWizard;
