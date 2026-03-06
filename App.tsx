
import React, { useState, useEffect } from 'react';
import { User, UserRole, Guideline, PropertyCase, CaseStatus } from './types';
import { INITIAL_USERS, MOCK_GUIDELINES } from './constants';
import Home from './components/Home';
import Login from './components/Login';
import RegisterAgent from './components/RegisterAgent';
import Layout from './components/Layout';
import AdminUserManagement from './components/Admin/UserManagement';
import AdminKnowledgeBase from './components/Admin/KnowledgeBase';
import AdminDashboard from './components/Admin/AdminDashboard';
import UnderwriterDashboard from './components/Underwriter/UnderwriterDashboard';
import UserDashboard from './components/User/UserDashboard';
import PropertyWizard from './components/User/PropertyWizard';
import CaseDetail from './components/Case/CaseDetail';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [guidelines, setGuidelines] = useState<Guideline[]>(MOCK_GUIDELINES);
  const [cases, setCases] = useState<PropertyCase[]>([]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [authView, setAuthView] = useState<'home' | 'login' | 'register'>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize data from LocalStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('insurshield_users_v2');
    const savedCases = localStorage.getItem('insurshield_cases_v2');
    const savedGuidelines = localStorage.getItem('insurshield_guidelines_v2');

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(INITIAL_USERS);
      localStorage.setItem('insurshield_users_v2', JSON.stringify(INITIAL_USERS));
    }

    if (savedCases) setCases(JSON.parse(savedCases));
    if (savedGuidelines) setGuidelines(JSON.parse(savedGuidelines));
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (users.length > 0) localStorage.setItem('insurshield_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (cases.length > 0) localStorage.setItem('insurshield_cases_v2', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    if (guidelines.length > 0) localStorage.setItem('insurshield_guidelines_v2', JSON.stringify(guidelines));
  }, [guidelines]);

  const handleLogin = (email: string, password?: string) => {
    setLoginError(null);
    const user = users.find(u => (u.email === email || u.id === email) && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setActiveView('dashboard');
    } else {
      setLoginError("Invalid credentials. Please verify your system identity or contact your Admin.");
    }
  };

  const handleRegisterAgent = (name: string, email: string, password?: string) => {
    setLoginError(null);
    const exists = users.find(u => u.email === email);
    if (exists) {
      setLoginError("Account Conflict: An agent with this identity already exists.");
      return;
    }

    const newUser: User = {
      id: `agent-${Date.now()}`,
      name,
      email,
      password,
      role: UserRole.AGENT,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('home');
    setActiveView('dashboard');
    setSelectedCaseId(null);
    setLoginError(null);
  };

  const handleUpdateCase = (updatedCase: PropertyCase) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleDeleteCase = (id: string) => {
    if (window.confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
      setCases(prev => prev.filter(c => c.id !== id));
      if (selectedCaseId === id) setSelectedCaseId(null);
    }
  };

  const handleCreateCase = (newCase: PropertyCase) => {
    setCases(prev => [newCase, ...prev]);
    setActiveView('dashboard');
  };

  const handleProvisionUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  if (!currentUser) {
    if (authView === 'home') {
      return (
        <Home 
          onStartLogin={() => setAuthView('login')} 
          onStartRegister={() => setAuthView('register')} 
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterAgent 
          onRegister={handleRegisterAgent} 
          onNavigateToLogin={() => { setAuthView('login'); setLoginError(null); }} 
          error={loginError} 
          onBackToHome={() => setAuthView('home')}
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin} 
        onNavigateToRegister={() => { setAuthView('register'); setLoginError(null); }} 
        error={loginError} 
        onBackToHome={() => setAuthView('home')}
      />
    );
  }

  const renderContent = () => {
    if (selectedCaseId) {
      const currentCase = cases.find(c => c.id === selectedCaseId);
      if (currentCase) {
        return (
          <CaseDetail 
            propertyCase={currentCase} 
            guidelines={guidelines} 
            user={currentUser}
            onUpdate={handleUpdateCase}
            onBack={() => setSelectedCaseId(null)}
          />
        );
      }
    }

    switch (activeView) {
      case 'dashboard':
        if (currentUser.role === UserRole.ADMIN_MANAGER) {
          return <AdminDashboard cases={cases} onViewCase={setSelectedCaseId} onDeleteCase={handleDeleteCase} />;
        }
        if (currentUser.role === UserRole.UNDERWRITER) {
          return <UnderwriterDashboard cases={cases} onViewCase={setSelectedCaseId} onDeleteCase={handleDeleteCase} />;
        }
        return (
          <UserDashboard 
            cases={cases.filter(c => c.userId === currentUser.id)} 
            onCreateCase={() => setActiveView('create-case')}
            onViewCase={setSelectedCaseId}
            onDeleteCase={handleDeleteCase}
          />
        );
      case 'users':
        return <AdminUserManagement users={users} onCreateUser={handleProvisionUser} onDeleteUser={id => setUsers(users.filter(u => u.id !== id))} />;
      case 'knowledge':
        return <AdminKnowledgeBase guidelines={guidelines} onUpdateGuidelines={setGuidelines} />;
      case 'create-case':
        return <PropertyWizard user={currentUser} onCreate={handleCreateCase} onCancel={() => setActiveView('dashboard')} guidelines={guidelines} />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      activeView={activeView} 
      onNavigate={setActiveView} 
      onLogout={handleLogout}
      onClearSelection={() => setSelectedCaseId(null)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
