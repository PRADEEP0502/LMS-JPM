import React, { useState } from 'react';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../../modules/auth/authService';

export const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError('Please enter your User ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await authService.requestPasswordReset(userId);
      setMessage(res.message);
    } catch (err) {
      setError(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserId('');
    setMessage(null);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Reset Password</h3>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {message ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle size={48} color="#166534" style={{ marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 600, marginBottom: '0.5rem' }}>
              Reset Instructions Dispatched
            </p>
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {message}
            </p>
            <button className="submit-btn" onClick={handleClose}>
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              Enter your corporate <strong>User ID</strong> below to receive password reset instructions via your registered Junior Processing Mill email address.
            </p>

            {error && (
              <div className="error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="forgot-userid">User ID</label>
              <div className="input-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input
                  id="forgot-userid"
                  type="text"
                  className="form-input"
                  placeholder="e.g. emp101, hr201, md301"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="submit-btn"
                style={{ backgroundColor: '#E2E8F0', color: '#334155' }}
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
