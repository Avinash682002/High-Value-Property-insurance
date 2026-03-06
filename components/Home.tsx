
import React from 'react';

interface HomeProps {
  onStartLogin: () => void;
  onStartRegister: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartLogin, onStartRegister }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-indigo-600 selection:text-white font-sans">
      {/* Premium Glass Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 py-5 transition-all duration-500">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <img 
              src="https://www.farmers.com/siteassets/002-duplicate-folders/farmers-a/marketing/digital/aem/images/misc/logo/farmers-ins-logo-2022-v1.png?width=1024&rmode=min&rsampler=bicubic" 
              alt="Farmers" 
              className="h-9 object-contain w-auto brightness-0" 
            />
            <div className="w-[1px] h-8 bg-slate-200 hidden md:block"></div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-black tracking-tighter uppercase leading-none text-slate-900">InsurShield <span className="text-indigo-600">AI</span></span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Strategic Risk Gateway</span>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <button onClick={onStartLogin} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-600 px-4 transition">Staff Portal</button>
              <button 
                onClick={onStartRegister}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Enroll as Partner
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modernist Hero */}
      <header className="relative pt-48 pb-32 px-10 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[120%] bg-white rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] bg-indigo-50 rounded-full blur-[100px] opacity-40"></div>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Integrated Underwriting Intelligence</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase">
              Beyond <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-700">Manual Audit</span>
            </h1>

            <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Eliminate the "hunt and peck" workflows in Claims Center and Assessor sites. InsurShield AI aggregates geospatial, visual, and claims data into a single verified verdict.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                onClick={onStartRegister}
                className="bg-indigo-600 text-white px-12 py-7 rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-5"
              >
                Access Partner Portal <i className="fa-solid fa-arrow-right text-[12px]"></i>
              </button>
            </div>

            <div className="flex items-center gap-12 pt-10 border-t border-slate-200">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">30m+</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saved per HV Case</span>
              </div>
              <div className="w-[1px] h-10 bg-slate-200"></div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">100%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Claims Verification</span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Element (Refined to match Screenshot) */}
          <div className="relative group animate-in zoom-in duration-1000 delay-300">
             <div className="absolute inset-0 bg-indigo-600/5 rounded-[4rem] blur-3xl group-hover:bg-indigo-600/10 transition-colors duration-1000"></div>
             
             {/* Simulated AI Generated Image Background */}
             <div className="absolute -z-10 -right-20 -bottom-20 w-80 h-80 opacity-20 group-hover:opacity-40 transition-opacity">
                <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover rounded-full rotate-12 blur-sm scale-125" alt="AI Generated Architecture" />
             </div>

             <div className="relative bg-white border border-slate-100 p-10 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden min-h-[500px] flex flex-col">
                {/* Header from Screenshot */}
                <div className="flex items-start justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white text-xl">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Claim Center Node</p>
                      <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-tighter">Active Loss Review</h3>
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-2">
                    {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: `${i*300}ms` }}></div>)}
                  </div>
                </div>

                {/* Body from Screenshot */}
                <div className="space-y-6 flex-grow flex flex-col justify-center">
                  <div className="p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 relative group/card overflow-hidden">
                    {/* Subtle Property Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-10 transition-opacity">
                      <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Property Scan" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Hazard Exposure Triage</p>
                      <div className="flex items-center justify-between">
                         <span className="text-6xl font-black text-[#0F172A] tracking-tighter">72.4</span>
                         <span className="px-6 py-3 bg-[#FF4767] text-white text-[10px] font-black uppercase rounded-full tracking-widest shadow-xl shadow-rose-500/20">Automated Cancel</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar from Screenshot */}
                  <div className="bg-[#0F172A] p-8 rounded-3xl flex items-center justify-between text-white shadow-2xl">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-400/20">
                        <i className="fa-solid fa-file-invoice-dollar text-xl text-indigo-400"></i>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Valuation Sync</p>
                        <p className="text-sm font-bold text-slate-400">Replacement Cost Verified</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <i className="fa-solid fa-check text-xs"></i>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Deep Intelligence Grid - Use Case Specific */}
      <section className="py-40 px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-32 space-y-6">
            <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.5em]">The Strategic Framework</p>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">Four Core <br /> Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { 
                title: 'High Value Evaluation', 
                desc: 'Verify replacement costs for $1M+ estates. Automated scanning of square footage and luxury features from Assessor and Realtor data.', 
                icon: 'fa-house-circle-check', 
                color: 'from-indigo-600 to-indigo-400' 
              },
              { 
                title: 'High Hazard Triage', 
                desc: 'Intelligent scoring for inspections. Automated system cancellations for hazard scores >= 72, reducing underwriter manual deep dives.', 
                icon: 'fa-radiation', 
                color: 'from-rose-600 to-rose-400' 
              },
              { 
                title: 'Claims Note Synthesis', 
                desc: 'Extrapolate unrepaired damage and insured negligence from Guidewire Claim Center adjuster notes without manual searching.', 
                icon: 'fa-file-signature', 
                color: 'from-emerald-600 to-emerald-400' 
              },
              { 
                title: 'Multi-Modal Referrals', 
                desc: 'Sync Zillow, Google Earth, and Betterview data to confirm foundation types, unique features, and living areas.', 
                icon: 'fa-satellite', 
                color: 'from-amber-600 to-amber-400' 
              }
            ].map((f, i) => (
              <div key={i} className="group p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
                <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${f.color} shadow-2xl flex items-center justify-center text-white text-3xl mb-12 group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standard Footer */}
      <footer className="py-20 px-10 border-t border-slate-100 bg-white">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">© 2025 InsurShield AI • Strategic Underwriting Gateway</span>
          <img 
            src="https://www.farmers.com/siteassets/002-duplicate-folders/farmers-a/marketing/digital/aem/images/misc/logo/farmers-ins-logo-2022-v1.png?width=1024&rmode=min&rsampler=bicubic" 
            alt="Farmers" 
            className="h-6 object-contain opacity-20" 
          />
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-flex; animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
};

export default Home;
