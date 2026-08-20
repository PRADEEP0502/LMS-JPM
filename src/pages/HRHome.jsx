import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { JpmLogo } from '../components/common/JpmLogo';
import { LogOut, BookOpen, Users, CheckCircle2 } from 'lucide-react';
import { WorkMasterList } from '../components/work-master/WorkMasterList';
import { MODULE_CATALOG } from '../data/mockUsers';
import '../styles/placeholders.css';

export const HRHome = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('work-master');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header className="app-header">
        <div className="header-brand">
          <JpmLogo size={32} variant="dark" />
          <div className="header-title">
            JPM <span>LMS</span> — HR Administration
          </div>
        </div>

        {/* HR Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: '2rem' }}>
          <button
            onClick={() => setActiveTab('work-master')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'work-master' ? 'var(--jpm-gold)' : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === 'work-master' ? 'var(--jpm-navy-dark)' : '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease'
            }}
          >
            <BookOpen size={16} /> Work Master
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'overview' ? 'var(--jpm-gold)' : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === 'overview' ? 'var(--jpm-navy-dark)' : '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease'
            }}
          >
            <Users size={16} /> HR Overview
          </button>
        </div>

        <div className="header-user-section" style={{ marginLeft: 'auto' }}>
          <div className="user-profile-summary">
            <div className="user-avatar" style={{ backgroundColor: '#EC4899', color: '#FFFFFF' }}>
              {user?.avatarInitials || 'HR'}
            </div>
            <div className="user-info-text">
              <span className="user-name">{user?.name || 'HR Manager'}</span>
              <span className="user-role-badge badge-hr">HR Administrator</span>
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
        {activeTab === 'work-master' ? (
          <WorkMasterList />
        ) : (
          <div>
            {/* Step 3 Notice */}
            <div className="step-status-banner" style={{ backgroundColor: '#FDF2F8', borderColor: '#F472B6' }}>
              <CheckCircle2 size={24} className="banner-icon" style={{ color: '#DB2777' }} />
              <div className="banner-content">
                <h3>STEP 3 COMPLETED — HR Work Master Active</h3>
                <p>
                  Logged in as <strong>{user?.name}</strong> ({user?.title} - {user?.department}). 
                  HR can create, edit, preview, and manage Work Master items along with Training Videos, SOPs, Learning Points, and Practical Training parameters.
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--jpm-navy)' }}>
              HR Administrative Modules
            </h2>

            <div className="placeholder-grid">
              {MODULE_CATALOG.filter(m => m.roleAccess.includes('HR')).map(mod => (
                <div key={mod.id} className="placeholder-card">
                  <div className="card-header">
                    <div className="card-icon" style={{ color: '#DB2777' }}>
                      <Users size={20} />
                    </div>
                    <h4 className="card-title">{mod.title}</h4>
                  </div>
                  <p className="card-desc">{mod.description}</p>
                  <span className="card-status-tag">Step 4+ Placeholder</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
