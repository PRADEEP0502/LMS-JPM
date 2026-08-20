import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import welcomeImg from '../../assets/onboarding_welcome.jpg';

export const WelcomeScreen = ({ userName, onStartJourney }) => {
  const firstName = userName ? userName.split(' ')[0] : 'Employee';

  return (
    <div className="welcome-hero-container">
      <div className="welcome-card">
        <div className="welcome-hero-badge">
          <Sparkles size={16} />
          <span>J.P. Morgan Employee Gateway</span>
        </div>

        <div className="welcome-hero-img-container">
          <img src={welcomeImg} alt="Welcome to JPM" className="welcome-hero-img" />
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
          borderTop: '1px solid rgba(255,255,255,0.15)'
        }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Your Onboarding Journey
          </h4>
          <p className="welcome-desc" style={{ marginBottom: '1.75rem' }}>
            Complete each step to begin your journey at JPM.
          </p>

          <button className="start-journey-btn" onClick={onStartJourney}>
            <span>Start My Journey</span>
            <ArrowRight size={20} />
          </button>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.8rem' }}>
          <ShieldCheck size={16} color="#C5A059" />
          <span>Official J.P. Morgan Onboarding System</span>
        </div>
      </div>
    </div>
  );
};
