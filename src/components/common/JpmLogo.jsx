import React from 'react';

export const JpmLogo = ({ size = 36, showText = false }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', verticalAlign: 'middle' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size > 32 ? '14px' : '10px',
          background: 'linear-gradient(135deg, #FF7A59 0%, #8B72E6 100%)',
          boxShadow: '0 8px 20px rgba(255, 122, 89, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: Math.round(size * 0.48),
          fontFamily: 'var(--font-family-heading)',
          flexShrink: 0,
          letterSpacing: '-0.02em',
          userSelect: 'none'
        }}
      >
        J
      </div>
      {showText && (
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--jpm-text)', fontFamily: 'var(--font-family-heading)', letterSpacing: '-0.02em' }}>
          JPM <span style={{ color: 'var(--jpm-primary)' }}>LMS</span>
        </span>
      )}
    </div>
  );
};
