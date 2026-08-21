import React from 'react';
import { Award, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFB399 0%, #B8A7EA 100%)', boxShadow: '0 16px 36px rgba(255, 122, 89, 0.3)' }} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: '#E8F8F2',
          border: '1px solid #A7F3D0',
          borderRadius: 'var(--radius-full)',
          color: '#0E9F6E',
          fontSize: '0.85rem',
          fontWeight: '800',
          marginBottom: '1rem'
        }}>
          <CheckCircle2 size={18} color="#0E9F6E" /> 100% Onboarding Complete
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--jpm-text)', marginBottom: '0.5rem' }}>
          🎉 Welcome to JPM!
        </h1>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--jpm-primary)', fontWeight: '800', marginBottom: '1rem' }}>
          Your onboarding is complete.
        </h3>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
          All 5 onboarding stages—Profile Verification, Official Document Check, Manager Orientation, IT Systems Setup, and Employee Declaration—have been verified.
        </p>

        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center'
        }}>
          <div><strong>Completion Timestamp:</strong> {formattedDate}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#059669" /> Recorded in JPM HR Onboarding System
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
