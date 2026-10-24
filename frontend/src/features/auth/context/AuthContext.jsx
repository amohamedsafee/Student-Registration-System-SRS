import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check current session from /api/auth/me on initial load
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch {
      // 401 or network error - session is invalid or anonymous
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen to global auth-expired events dispatched by apiClient
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener('llc:auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('llc:auth-expired', handleAuthExpired);
    };
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
