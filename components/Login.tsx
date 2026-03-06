
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password?: string) => void;
  onNavigateToRegister: () => void;
  error: string | null;
  onBackToHome: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, error, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 md:p-8 relative overflow-hidden">
      {/* Security Atmosphere */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10 animate-in fade-in zoom-in duration-700 overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-slate-900/50 backdrop-blur-3xl">
        
        {/* Left Panel: Brand & Info */}
        <div className="lg:col-span-5 p-10 md:p-14 bg-gradient-to-br from-indigo-600/20 to-transparent border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <i className="fa-solid fa-shield-halved text-[20rem] -translate-x-20 -translate-y-20"></i>
          </div>

          <div className="relative z-10">
            <button 
              onClick={onBackToHome}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition flex items-center gap-3 mb-16 group"
            >
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Exit Gateway
            </button>
            
            <div className="mb-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                 <img 
                    src="https://www.farmers.com/siteassets/002-duplicate-folders/farmers-a/marketing/digital/aem/images/misc/logo/farmers-ins-logo-2022-v1.png?width=1024&rmode=min&rsampler=bicubic" 
                    alt="Logo" 
                    className="h-6 w-auto brightness-0" 
                  />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-4">Staff <br /> <span className="text-indigo-400">Terminal</span></h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                Restricted access for Underwriting Specialists and Strategic Risk Administrators.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                 <i className="fa-solid fa-circle-info text-indigo-400 text-xs"></i>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sandbox Access</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                   <span className="font-bold text-slate-500 uppercase">System ID:</span>
                   <span className="font-black text-indigo-300">admin</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                   <span className="font-bold text-slate-500 uppercase">Secret:</span>
                   <span className="font-black text-indigo-300">password123</span>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em]">ISO 27001 • v2.0.4</p>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="lg:col-span-7 p-10 md:p-14 flex flex-col justify-center bg-white/5">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-2">Internal Identity</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Verify Credentials to Proceed</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] p-5 rounded-2xl animate-in shake duration-500 flex items-center gap-4 font-black uppercase tracking-wider">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="relative group">
                  <i className="fa-solid fa-id-card-clip absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors"></i>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="System ID"
                    className="w-full pl-16 pr-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <i className="fa-solid fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors"></i>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Security Secret"
                    className="w-full pl-16 pr-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-600 text-sm"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl shadow-2xl transition-all transform active:scale-[0.98] uppercase tracking-[0.4em] text-[10px]"
              >
                Authenticate Specialist
              </button>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-white/5">
              <p className="text-[10px] text-slate-600 mb-4 font-black uppercase tracking-widest">External Agency Partner?</p>
              <button 
                onClick={onNavigateToRegister}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors py-2 px-6 border border-indigo-400/30 rounded-full hover:bg-indigo-600/20"
              >
                Enroll Partner Gateway
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
