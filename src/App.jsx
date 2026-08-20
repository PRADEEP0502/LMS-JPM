import React from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { EmployeeHome } from './pages/EmployeeHome';
import { HRHome } from './pages/HRHome';
import { MDHome } from './pages/MDHome';
import './styles/global.css';

export function AppContent() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A2240',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            JPM <span style={{ color: '#C5A059' }}>LMS</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Loading Security Context...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  switch (role) {
    case 'EMPLOYEE':
      return <EmployeeHome />;
    case 'HR':
      return <HRHome />;
    case 'MD':
      return <MDHome />;
    default:
      return <LoginPage />;
  }
}

export default function App() {
  return <AppContent />;
}
