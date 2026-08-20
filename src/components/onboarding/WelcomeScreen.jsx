import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const WelcomeScreen = ({ userName, onStartJourney }) => {
  const firstName = userName ? userName.split(' ')[0] : 'Employee';

  return (
    <div className="welcome-hero-container">
      <div className="welcome-card">
        <div className="welcome-hero-badge">
          <Sparkles size={16} />
          <span>Junior Processing Mill Employee Gateway</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div className="sense-orb" style={{ width: '88px', height: '88px', boxShadow: '0 16px 36px rgba(255, 94, 126, 0.45)' }} />
        </div>

        <h1 className="welcome-title">
          Welcome to JPM, {firstName} 👋
        </h1>
        <h3 className="welcome-subtitle">
          Your journey starts here.
        </h3>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Your Onboarding Journey
          </h4>
          <p className="welcome-desc" style={{ marginBottom: '1.75rem' }}>
            Complete each step to begin your journey at Junior Processing Mill.
          </p>

          <button className="start-journey-btn" onClick={onStartJourney}>
            <span>Start My Journey</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <ShieldCheck size={16} color="#FF5E7E" />
          <span>Official Junior Processing Mill Onboarding System</span>
        </div>
      </div>
    </div>
  );
};
