
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onClearSelection: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, activeView, onNavigate, onLogout, onClearSelection, children }) => {
  const isManager = user.role === UserRole.ADMIN_MANAGER;
  const isUnderwriter = user.role === UserRole.UNDERWRITER;
  const isAgent = user.role === UserRole.AGENT;

  const handleNav = (view: string) => {
    onClearSelection();
    onNavigate(view);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Sidebar: Unified Dark Theme */}
      <aside className="w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-[10px_0_40px_-10px_rgba(0,0,0,0.1)] z-[100] border-r border-white/5">
        <div className="p-8 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_8px_20px_-5px_rgba(79,70,229,0.5)] border border-indigo-400/20">
              <i className="fa-solid fa-shield-halved text-white text-lg"></i>
            </div>
            <div>
              <span className="font-black text-lg tracking-tighter block leading-none text-white uppercase">InsurShield <span className="text-indigo-400">AI</span></span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1.5 block">Strategic Risk</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Navigation</p>
          
          <button 
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeView === 'dashboard' ? 'bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <i className={`fa-solid ${isAgent ? 'fa-briefcase' : 'fa-gauge-high'}`}></i>
            <span>{isAgent ? 'Partner Portal' : 'Staff Command'}</span>
          </button>

          {isManager && (
            <>
              <p className="px-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-8 mb-4">Governance</p>
              <button 
                onClick={() => handleNav('users')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeView === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <i className="fa-solid fa-users-gear"></i>
                <span>User Access</span>
              </button>
              <button 
                onClick={() => handleNav('knowledge')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeView === 'knowledge' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <i className="fa-solid fa-book-bookmark"></i>
                <span>Policy KB</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-8 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-400/20 rounded-2xl flex items-center justify-center uppercase font-black text-indigo-400 shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black truncate text-white uppercase tracking-tight">{user.name}</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 text-slate-500 hover:text-rose-400 border border-white/5 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <i className="fa-solid fa-power-off"></i>
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto bg-slate-50 relative custom-scrollbar">
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 px-12 py-6 flex justify-between items-center">
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">System Status:</span>
             <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Intelligence Sync Active</span>
           </div>
           <div className="flex items-center gap-6">
              <img 
                src="https://www.farmers.com/siteassets/002-duplicate-folders/farmers-a/marketing/digital/aem/images/misc/logo/farmers-ins-logo-2022-v1.png?width=1024&rmode=min&rsampler=bicubic" 
                alt="Farmers" 
                className="h-6 object-contain opacity-20" 
              />
           </div>
        </header>
        <div className="max-w-[1400px] mx-auto p-12">
          {children}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default Layout;
