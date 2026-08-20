import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { Crown, CheckCircle2, Bell } from 'lucide-react';
import { MODULE_CATALOG } from '../data/mockUsers';
import '../styles/placeholders.css';

export const MDHome = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-layout-container">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} role="MD" />

      <main className="app-main-content">
        <header className="jpm-topbar">
          <div className="topbar-left">JPM LMS Executive Gateway</div>
          <div className="topbar-right">
            <button className="topbar-icon-btn" title="Notifications">
              <Bell size={16} />
            </button>
            <div className="topbar-user-pill">
              <div className="topbar-avatar" style={{ backgroundColor: '#D4AF37', color: '#07192F' }}>
                {user?.avatarInitials || 'MD'}
              </div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">{user?.name || 'Robert Sterling'}</span>
                <span className="topbar-user-sub">Managing Director</span>
              </div>
            </div>
          </div>
        </header>

        <div className="step-status-banner">
          <CheckCircle2 size={24} className="banner-icon" style={{ color: 'var(--jpm-gold)' }} />
          <div className="banner-content">
            <h3>Managing Director Executive Gateway</h3>
            <p>
              Logged in as <strong>{user?.name}</strong> ({user?.title} - {user?.department}). 
              Executive privileges verified. High-level compliance analytics and ABCD oversight tools unlocked.
            </p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--jpm-text)', marginBottom: '1rem' }}>
          Executive Supervision & Compliance Modules
        </h2>

        <div className="placeholder-grid">
          {MODULE_CATALOG.filter(m => m.roleAccess.includes('MD')).map(mod => (
            <div key={mod.id} className="placeholder-card">
              <div className="card-header">
                <div className="card-icon" style={{ color: 'var(--jpm-gold)' }}>
                  <Crown size={22} />
                </div>
                <h4 className="card-title">{mod.title}</h4>
              </div>
              <p className="card-desc">{mod.description}</p>
              <span className="card-status-tag">Executive Overview</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
