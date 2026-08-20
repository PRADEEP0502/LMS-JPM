import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JpmLogo } from '../components/common/JpmLogo';
import { ForgotPasswordModal } from '../components/common/ForgotPasswordModal';
import heroImage from '../assets/jpm_lms_hero.jpg';
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
    if (!userId.trim() || !password.trim()) {
      return;
    }

    setLoading(true);
    try {
      await login(userId, password);
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Quick autofill helper for testing demo credentials
  const handleQuickLogin = (demoId, demoPass) => {
    setUserId(demoId);
    setPassword(demoPass);
    clearError();
  };

  return (
    <div className="login-page-container">
      {/* Left Visual Panel */}
      <div className="login-visual-panel">
        <div className="login-visual-overlay" />
        
        <div className="visual-brand-header">
          <JpmLogo size={36} variant="dark" />
          <span className="brand-badge">J.P. Morgan Global LMS</span>
        </div>

        <div className="visual-content">
          <div className="visual-image-wrapper">
            <img 
              src={heroImage} 
              alt="J.P. Morgan Learning Management Platform" 
              className="visual-hero-image" 
            />
          </div>
          <h1 className="visual-title">
            Enterprise <span>Learning</span> & Excellence System
          </h1>
          <p className="visual-description">
            Empowering J.P. Morgan teams with structured learning pathways, policy compliance, and performance milestones.
          </p>
        </div>

        <div className="visual-footer">
          <span>&copy; {new Date().getFullYear()} J.P. Morgan Chase & Co. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#C5A059" /> 256-Bit Encrypted Gateway
          </span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-logo-row">
              <JpmLogo size={42} />
              <div className="jpm-logo-text">
                JPM <span className="jpm-logo-tag">LMS</span>
              </div>
            </div>
            <h2 className="login-title">Sign In to JPM LMS</h2>
            <p className="login-subtitle">
              Enter your corporate User ID and Password to access your learning portal.
            </p>
          </div>

          {error && (
            <div className="error-banner" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* User ID Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="user-id">User ID</label>
              <div className="input-wrapper">
                <User className="input-icon-left" size={18} />
                <input
                  id="user-id"
                  type="text"
                  className={`form-input ${error ? 'has-error' : ''}`}
                  placeholder="Enter User ID (e.g. emp101)"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (error) clearError();
                  }}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="form-label">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => setIsForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${error ? 'has-error' : ''}`}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Demo Credentials Quick Switcher */}
          <div className="demo-accounts-card">
            <div className="demo-title">
              <span>Demo Accounts (Step 1 Testing)</span>
            </div>
            <div className="demo-chips">
              <button
                type="button"
                className="demo-chip"
                onClick={() => handleQuickLogin('emp101', 'password123')}
                title="Login as Employee"
              >
                <span className="demo-role">Employee</span>
                <span className="demo-id">emp101</span>
              </button>

              <button
                type="button"
                className="demo-chip"
                onClick={() => handleQuickLogin('hr201', 'password123')}
                title="Login as HR"
              >
                <span className="demo-role">HR</span>
                <span className="demo-id">hr201</span>
              </button>

              <button
                type="button"
                className="demo-chip"
                onClick={() => handleQuickLogin('md301', 'password123')}
                title="Login as MD"
              >
                <span className="demo-role">MD</span>
                <span className="demo-id">md301</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};
