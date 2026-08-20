import React from 'react';
import { Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import completeImg from '../../assets/onboarding_complete.jpg';

export const CompletionScreen = ({ userName, completedAt, onFinish }) => {
  const formattedDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString();

  return (
    <div className="completion-container">
      <div className="completion-card">
        <div className="completion-img-wrapper">
          <img src={completeImg} alt="Onboarding Completed" className="completion-img" />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'var(--jpm-gold-light)',
          border: '1px solid var(--jpm-gold)',
          borderRadius: 'var(--radius-full)',
          color: 'var(--jpm-navy)',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          <CheckCircle2 size={18} color="#C5A059" /> 100% Onboarding Complete
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--jpm-navy)', marginBottom: '0.5rem' }}>
          🎉 Welcome to JPM!
        </h1>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--jpm-gold-hover)', fontWeight: '600', marginBottom: '1rem' }}>
          Your onboarding is complete.
        </h3>

        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          All 5 onboarding stages—Profile Verification, Official Document Check, Manager Orientation, IT Systems Setup, and Employee Declaration—have been verified.
        </p>

        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center'
        }}>
          <div><strong>Completion Timestamp:</strong> {formattedDate}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#166534" /> Recorded in JPM HR Onboarding System
          </div>
        </div>

        <button className="start-journey-btn" onClick={onFinish} style={{ width: '100%' }}>
          <span>Continue to Employee Home</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
