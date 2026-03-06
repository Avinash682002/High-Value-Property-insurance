
import React, { useState } from 'react';
import { User, UserRole } from '../../types';

interface UserManagementProps {
  users: User[];
  onCreateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onCreateUser, onDeleteUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: UserRole.UNDERWRITER });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    onCreateUser(newUser);
    setShowModal(false);
    setFormData({ name: '', email: '', password: '', role: UserRole.UNDERWRITER });
  };

  const handleDeleteClick = (userId: string) => {
    // Primary Admin Protection
    if (userId === 'admin-1') return;
    setConfirmDeleteId(userId);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      onDeleteUser(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const internalStaff = users.filter(u => u.role !== UserRole.AGENT);
  const externalAgents = users.filter(u => u.role === UserRole.AGENT);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Governance</h1>
          <p className="text-slate-500">Provision and manage internal Underwriters and System Administrators</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
        >
          <i className="fa-solid fa-user-plus text-sm"></i>
          Provision Staff Account
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Personnel Registry</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Access Level</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Provenance</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...internalStaff, ...externalAgents].map(user => {
              const isAgent = user.role === UserRole.AGENT;
              return (
                <tr key={user.id} className={`hover:bg-slate-50/50 transition group ${isAgent ? 'bg-slate-50/20' : ''}`}>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1.5">{user.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      user.role === UserRole.ADMIN_MANAGER ? 'bg-indigo-100 text-indigo-700' : 
                      user.role === UserRole.UNDERWRITER ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-500 font-medium">
                    {isAgent ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <i className="fa-solid fa-globe text-[10px]"></i> External Enrollment
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-indigo-400">
                        <i className="fa-solid fa-key text-[10px]"></i> System Provisioned
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {confirmDeleteId === user.id ? (
                      <div className="flex justify-end items-center gap-3 animate-in slide-in-from-right-2 duration-200">
                        <button 
                          onClick={confirmDelete}
                          className="text-[10px] bg-rose-600 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest shadow-lg"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-black uppercase tracking-widest"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => handleDeleteClick(user.id)}
                        className={`transition p-3 rounded-xl inline-flex items-center justify-center ${user.id === 'admin-1' ? 'text-slate-100 cursor-not-allowed opacity-20' : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50'}`}
                        disabled={user.id === 'admin-1'}
                      >
                        <i className="fa-solid fa-user-xmark text-base"></i>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 animate-in zoom-in duration-300 border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Provision Personnel</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Internal Staff Deployment</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition p-2">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Legal Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. James Wilson"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition font-medium text-sm bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">System Identity (Login ID)</label>
                <input 
                  type="text" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g. jwilson_uw"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition font-medium text-sm bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Access Secret</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition font-medium text-sm bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Authorized Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition bg-slate-50/50 font-bold text-sm"
                >
                  <option value={UserRole.UNDERWRITER}>Underwriter Specialist</option>
                  <option value={UserRole.ADMIN_MANAGER}>System Administrator</option>
                </select>
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                    <i className="fa-solid fa-circle-info mr-1.5"></i>
                    Agent accounts cannot be created via internal governance. External partners must self-enroll via the public Partner Gateway.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-4 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/30"
                >
                  Deploy Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
