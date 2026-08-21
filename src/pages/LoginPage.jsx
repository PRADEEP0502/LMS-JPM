import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JpmLogo } from '../components/common/JpmLogo';
import { ForgotPasswordModal } from '../components/common/ForgotPasswordModal';
import '../styles/login.css';

export const LoginPage = () => {
  const { login, error, clearError } = useAuth();
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await login(userId, password);
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoId, demoPass) => {
    setUserId(demoId);
    setPassword(demoPass);
    clearError();
  };

  return (
    <div className="login-page-container">
      <div className="login-glass-card">
        {/* Left Brand Panel */}
        <div className="login-brand-panel">
          <div className="login-brand-header">
            <JpmLogo size={36} />
            <div className="login-brand-title">
              JPM <span>LMS</span>
            </div>
          </div>

          <div className="login-brand-body">
            <span className="login-hero-tag">Junior Processing Mill</span>
            <h1 className="login-hero-heading">
              Enterprise <span>Learning</span> & Excellence System
            </h1>
            <p className="login-hero-desc">
              Empowering Junior Processing Mill teams with structured learning pathways, policy compliance, and performance milestones.
            </p>
          </div>

          <div className="login-brand-footer">
            <span>&copy; {new Date().getFullYear()} Junior Processing Mill</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--jpm-primary)" /> Encrypted Gateway
            </span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h2>Sign In to JPM LMS</h2>
            <p>Enter your corporate User ID and Password to access your portal.</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1rem', background: 'var(--error-bg)', color: 'var(--error-text)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="userId">User ID</label>
              <div className="input-capsule-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="userId"
                  type="text"
                  className="input-capsule"
                  placeholder="Enter User ID (e.g. emp101)"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (error) clearError();
                  }}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--jpm-primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => setIsForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-capsule-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-capsule"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '1.15rem', background: 'none', border: 'none', color: 'var(--jpm-muted)', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="demo-accounts-card">
            <div className="demo-title">DEMO ACCOUNTS (TESTING)</div>
            <div className="demo-grid">
              <button className="demo-btn" onClick={() => handleQuickLogin('emp101', 'password123')} type="button">
                <span className="demo-role">Employee</span>
                <span className="demo-id">emp101</span>
              </button>
              <button className="demo-btn" onClick={() => handleQuickLogin('hr201', 'password123')} type="button">
                <span className="demo-role">HR</span>
                <span className="demo-id">hr201</span>
              </button>
              <button className="demo-btn" onClick={() => handleQuickLogin('md301', 'password123')} type="button">
                <span className="demo-role">MD</span>
                <span className="demo-id">md301</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};
