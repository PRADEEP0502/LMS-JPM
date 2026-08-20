import React from 'react';

export const JpmLogo = ({ size = 32, variant = 'default' }) => {
  const isDark = variant === 'dark';
  const primaryColor = isDark ? '#FFFFFF' : '#0A2240';
  const goldColor = '#C5A059';

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill={primaryColor} />
      {/* Abstract geometric JPM emblem */}
      <path d="M10 10H30V14H10V10Z" fill={goldColor} />
      <path d="M10 18H24V22H10V18Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M10 26H28V30H10V26Z" fill={goldColor} />
    </svg>
  );
};
