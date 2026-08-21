import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { JpmLogo } from '../components/common/JpmLogo';
import { Crown, CheckCircle2, Bell, Users, BookOpen, Layers, ShieldCheck, Clock, Award, Activity, Building } from 'lucide-react';
import { workMasterService } from '../modules/work-master/workMasterService';
import { abcdService } from '../modules/abcd/abcdService';
import { assignmentService } from '../modules/assignment/assignmentService';
import { MOCK_USERS } from '../data/mockUsers';
import '../styles/placeholders.css';
import '../styles/abcd.css';

export const MDHome = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const works = workMasterService.getWorks();
  const allAssignments = assignmentService.getAllAssignments();
  const allAbcd = abcdService.getAllProgress();
  const pendingVerifications = abcdService.getPendingVerifications();

  const totalEmployees = MOCK_USERS.filter(u => u.role === 'EMPLOYEE').length;
  const completedWorks = allAbcd.filter(a => a.overallStatus === 'COMPLETED').length;
  const inProgressWorks = allAbcd.filter(a => a.overallStatus === 'IN_PROGRESS').length;

  // Department progress stats
  const deptStats = [
    { name: 'Corporate Operations', active: 3, completed: 2, percent: 85 },
    { name: 'Data Entry', active: 4, completed: 3, percent: 78 },
    { name: 'Accounts', active: 2, completed: 1, percent: 65 },
    { name: 'Global HR', active: 2, completed: 2, percent: 100 }
  ];

  return (
    <div className="app-layout-container">
      {/* Executive Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} role="MD" />

      {/* Executive Workspace */}
      <main className="app-main-content">
        {/* Topbar */}
        <header className="jpm-topbar">
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <JpmLogo size={32} />
            <span>Junior Processing Mill &bull; Executive Portal</span>
          </div>
          <div className="topbar-right">
            <button className="topbar-icon-btn" title="Notifications" onClick={() => alert('Executive alert: System status optimal.')}>
              <Bell size={16} />
            </button>
            <div className="topbar-user-pill">
              <div className="topbar-avatar" style={{ backgroundColor: 'var(--jpm-primary)' }}>
                {user?.avatarInitials || 'RS'}
              </div>
              <div className="topbar-user-info">
                <span className="topbar-user-name">{user?.name || 'Robert Sterling'}</span>
                <span className="topbar-user-sub">Managing Director</span>
              </div>
            </div>
          </div>
        </header>

        {/* Executive Banner */}
        <div className="step-status-banner">
          <Crown size={26} className="banner-icon" style={{ color: 'var(--jpm-gold)' }} />
          <div className="banner-content">
            <h3>Executive Leadership & Compliance Gateway</h3>
            <p>
              Welcome, <strong>{user?.name}</strong>. Real-time executive supervision for Junior Processing Mill employees, onboarding milestone tracking, Work Master library audit, and ABCD stage entitlement verifications.
            </p>
          </div>
        </div>

        {/* Executive Overview KPI Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--jpm-primary-soft)', color: 'var(--jpm-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--jpm-muted)' }}>Total Employees</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--jpm-text)' }}>{totalEmployees}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--jpm-gold-soft)', color: 'var(--jpm-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--jpm-muted)' }}>Work Master Library</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--jpm-text)' }}>{works.length}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--jpm-muted)' }}>Completed Works</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>{completedWorks}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--jpm-muted)' }}>Pending HR Audit</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>{pendingVerifications.length}</div>
            </div>
          </div>
        </div>

        {/* Department Progress Composition */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.75rem', marginTop: '0.5rem' }}>
          {/* Left: Departmental Progress Breakdown */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <Building size={22} color="var(--jpm-primary)" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--jpm-text)' }}>Departmental Competency & Training Progress</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {deptStats.map((dept, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--jpm-text)' }}>{dept.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--jpm-text-secondary)' }}>
                        {dept.completed} Completed &bull; {dept.active} Active Assigned Works
                      </span>
                    </div>
                    <span className="jpm-badge-purple" style={{ fontSize: '0.85rem' }}>{dept.percent}% Compliance</span>
                  </div>
                  <div className="emp-progress-bar-track">
                    <div className="emp-progress-bar-fill" style={{ width: `${dept.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Real-time ABCD Verification Status Summary */}
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <Activity size={20} color="var(--jpm-gold)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--jpm-text)' }}>ABCD Audit Status</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--jpm-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                HR handles 100% of stage verifications (A &rarr; B &rarr; C &rarr; D). No supervisor role required.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--jpm-surface-solid)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--jpm-border-dark)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jpm-text)' }}>A — Learned Verified</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>100%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--jpm-surface-solid)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--jpm-border-dark)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jpm-text)' }}>B — Practical Verified</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>75%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--jpm-surface-solid)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--jpm-border-dark)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jpm-text)' }}>C — Can Perform Verified</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--jpm-primary)' }}>50%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--jpm-surface-solid)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--jpm-border-dark)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--jpm-text)' }}>D — Final Performance</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--jpm-gold)' }}>25%</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--jpm-border-dark)', fontSize: '0.8rem', color: 'var(--jpm-muted)', textAlign: 'center' }}>
              Junior Processing Mill &bull; Executive LMS Audit
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
