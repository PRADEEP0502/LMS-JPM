import React from 'react';

export const JpmLogo = ({ size = 32, variant = 'default' }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #5B3CC4 0%, #7C5CE6 100%)',
          boxShadow: '0 6px 16px rgba(91, 60, 196, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: size * 0.45,
          fontFamily: 'var(--font-family-heading)',
          flexShrink: 0
        }}
      >
        J
      </div>
    </div>
  );
};
