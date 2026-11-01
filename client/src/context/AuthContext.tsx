'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  savedListings: string[];
  setSavedListings: React.Dispatch<React.SetStateAction<string[]>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedListings, setSavedListings] = useState<string[]>([]);

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data.user) {
        setUser(res.data.user);
        setSavedListings(res.data.user.savedListings || []);
      }
    } catch (err) {
      setUser(null);
      setSavedListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authApi.login(credentials);
    if (res.success && res.data.user) {
      setUser(res.data.user);
      setSavedListings(res.data.user.savedListings || []);
    }
  };

  const signup = async (userData: any) => {
    const res = await authApi.signup(userData);
    if (res.success && res.data.user) {
      setUser(res.data.user);
      setSavedListings(res.data.user.savedListings || []);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setSavedListings([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        savedListings,
        setSavedListings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
