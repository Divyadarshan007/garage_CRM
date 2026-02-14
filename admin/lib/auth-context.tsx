'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './auth';
import { authAPI } from './api-client';

interface Admin {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = async () => {
    if (!auth.isAuthenticated()) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await authAPI.getProfile();
      if (res.success && res.data?.admin) {
        setAdmin(res.data.admin);
      } else {
        auth.removeToken();
        setAdmin(null);
      }
    } catch {
      auth.removeToken();
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    if (!res.success || !res.data?.token) {
      throw new Error(res.message || 'Login failed');
    }
    auth.setToken(res.data.token);
    if (res.data.admin) {
      setAdmin(res.data.admin);
    } else {
      await refreshProfile();
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      /* ignore */
    } finally {
      auth.removeToken();
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: auth.isAuthenticated(),
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
