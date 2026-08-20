import React from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { notificationService } from '../../modules/notification/notificationService';

export const NotificationBanner = ({ userId, onDismiss }) => {
  const notifications = notificationService.getNotifications(userId);
  const unread = notifications.filter(n => !n.read);

  if (unread.length === 0) return null;

  const latest = unread[0];

  const iconMap = {
    success: <CheckCircle2 size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Info size={18} />,
    error: <AlertTriangle size={18} />
  };

  const colorMap = {
    success: { bg: 'var(--success-bg)', border: '#86EFAC', color: 'var(--success-text)' },
    warning: { bg: 'var(--warning-bg)', border: 'var(--warning-border)', color: 'var(--warning-text)' },
    info: { bg: '#EFF6FF', border: '#93C5FD', color: '#1E40AF' },
    error: { bg: 'var(--error-bg)', border: 'var(--error-border)', color: 'var(--error-text)' }
  };

  const scheme = colorMap[latest.type] || colorMap.info;

  const handleDismiss = () => {
    notificationService.markAllRead(userId);
    onDismiss?.();
  };

  return (
    <div className="notification-banner" style={{
      backgroundColor: scheme.bg,
      border: `1px solid ${scheme.border}`,
      color: scheme.color,
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '1rem',
      animation: 'detailFade 300ms ease-out'
    }}>
      <span style={{ flexShrink: 0 }}>{iconMap[latest.type]}</span>
      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{latest.message}</span>
      {unread.length > 1 && (
        <span style={{
          fontSize: '0.725rem', fontWeight: 700, padding: '2px 8px',
          backgroundColor: scheme.color, color: '#FFFFFF', borderRadius: 'var(--radius-full)'
        }}>
          +{unread.length - 1} more
        </span>
      )}
      <button onClick={handleDismiss} style={{ padding: '4px', color: scheme.color, flexShrink: 0 }} title="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
};
