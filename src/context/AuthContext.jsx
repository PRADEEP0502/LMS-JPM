import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../modules/auth/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'jpm_lms_user_session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from localStorage on initial load
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      }
    } catch (err) {
      console.error('Failed to parse saved session:', err);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (userId, password) => {
    setError(null);
    try {
      const userSession = await authService.login(userId, password);
      setUser(userSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession));
      return userSession;
    } catch (err) {
      setError(err.message || 'Authentication failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
