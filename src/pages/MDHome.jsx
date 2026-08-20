import React from 'react';
import { useAuth } from '../context/AuthContext';
import { JpmLogo } from '../components/common/JpmLogo';
import { LogOut, Crown, PieChart, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MODULE_CATALOG } from '../data/mockUsers';
import '../styles/placeholders.css';

export const MDHome = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header className="app-header">
        <div className="header-brand">
          <JpmLogo size={32} variant="dark" />
          <div className="header-title">
            JPM <span>LMS</span> — Executive Gateway
          </div>
        </div>

        <div className="header-user-section">
          <div className="user-profile-summary">
            <div className="user-avatar" style={{ backgroundColor: '#D4AF37', color: '#07192F' }}>
              {user?.avatarInitials || 'MD'}
            </div>
            <div className="user-info-text">
              <span className="user-name">{user?.name || 'Managing Director'}</span>
              <span className="user-role-badge badge-md">Managing Director</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign Out">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="dashboard-container">
        {/* Step 1 Completion Notice */}
        <div className="step-status-banner" style={{ backgroundColor: '#FEFCE8', borderColor: '#EAB308' }}>
          <CheckCircle2 size={24} className="banner-icon" style={{ color: '#CA8A04' }} />
          <div className="banner-content">
            <h3>STEP 1 COMPLETED — Managing Director Gateway Placeholder</h3>
            <p>
              Logged in as <strong>{user?.name}</strong> ({user?.title} - {user?.department}). 
              Executive privileges verified. High-level compliance analytics and ABCD oversight tools will unlock in Step 2+.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--jpm-navy)' }}>
          Executive Supervision & Analytics
        </h2>

        <div className="placeholder-grid">
          {MODULE_CATALOG.filter(m => m.roleAccess.includes('MD')).map(mod => (
            <div key={mod.id} className="placeholder-card">
              <div className="card-header">
                <div className="card-icon" style={{ color: '#CA8A04' }}>
                  <Crown size={20} />
                </div>
                <h4 className="card-title">{mod.title}</h4>
              </div>
              <p className="card-desc">{mod.description}</p>
              <span className="card-status-tag">Step 2+ Placeholder</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
