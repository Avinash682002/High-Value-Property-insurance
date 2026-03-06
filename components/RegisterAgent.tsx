
import React, { useState } from 'react';

interface RegisterAgentProps {
  onRegister: (name: string, email: string, password?: string) => void;
  onNavigateToLogin: () => void;
  error: string | null;
  onBackToHome: () => void;
}

const RegisterAgent: React.FC<RegisterAgentProps> = ({ onRegister, onNavigateToLogin, error, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onRegister(name, email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Enterprise Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 animate-in fade-in zoom-in duration-700 overflow-hidden rounded-[3.5rem] border border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] bg-white">
        
        {/* Left Panel: Partner Value Proposition */}
        <div className="lg:col-span-5 p-12 md:p-16 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <i className="fa-solid fa-handshake-angle text-[25rem] translate-x-10 translate-y-20"></i>
          </div>

          <div className="relative z-10">
            <button 
              onClick={onBackToHome}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition flex items-center gap-3 mb-20 group"
            >
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Return Home
            </button>
            
            <div className="space-y-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                 <img 
                    src="https://www.farmers.com/siteassets/002-duplicate-folders/farmers-a/marketing/digital/aem/images/misc/logo/farmers-ins-logo-2022-v1.png?width=1024&rmode=min&rsampler=bicubic" 
                    alt="Logo" 
                    className="h-6 w-auto brightness-0" 
                  />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.85] mb-6">Partner <br /> <span className="text-indigo-400">Enrollment</span></h1>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xs">
                  Join the elite network of agencies utilizing Strategic Risk Intelligence to bind high-value assets faster.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <i className="fa-solid fa-bolt"></i>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Instant Sync</p>
                  <p className="text-xs font-bold text-slate-300">Automated replacement cost verification.</p>
               </div>
            </div>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em]">Proprietary Underwriting Gateway v2.5</p>
          </div>
        </div>

        {/* Right Panel: Enrollment Form */}
        <div className="lg:col-span-7 p-12 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Agency Registration</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Initialize your secure partner identity</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] p-5 rounded-2xl animate-in shake duration-500 flex items-center gap-4 font-black uppercase tracking-wider">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Professional Name</label>
                <div className="relative group">
                  <i className="fa-solid fa-user-tie absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all placeholder:text-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Agency Business Email</label>
                <div className="relative group">
                  <i className="fa-solid fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@agency-corp.com"
                    className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all placeholder:text-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Access Secret</label>
                <div className="relative group">
                  <i className="fa-solid fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all placeholder:text-slate-300 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-6 rounded-2xl shadow-2xl transition-all transform active:scale-[0.98] uppercase tracking-[0.4em] text-[10px]"
                >
                  Confirm & Initialize Gateway
                </button>
              </div>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-slate-50">
              <p className="text-[10px] text-slate-400 mb-4 font-black uppercase tracking-widest">Already have an active dossier?</p>
              <button 
                onClick={onNavigateToLogin}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-slate-900 transition-colors py-2 px-8 border border-indigo-100 rounded-full hover:bg-indigo-50"
              >
                Sign In to Portal
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterAgent;
