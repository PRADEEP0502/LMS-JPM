import React from 'react';

export const JpmLogo = ({ size = 32, variant = 'default' }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #FFA585, #FF5E7E 50%, #8E2DE2 100%)',
          boxShadow: '0 6px 16px rgba(255, 94, 126, 0.4)',
          flexShrink: 0
        }}
      />
    </div>
  );
};
