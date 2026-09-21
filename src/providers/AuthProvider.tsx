'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

import { authQueryOptions } from '@/lib/authQuery';
import type { AuthUser } from '@/types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: unknown;
  refetch: ReturnType<typeof useQuery>['refetch'];
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const query = useQuery(authQueryOptions());

  const value = useMemo<AuthContextValue>(
    () => ({
      user: query.data ?? null,
      isLoading: query.isLoading,
      isAuthenticated: !!query.data,
      error: query.error,
      refetch: query.refetch,
    }),
    [query.data, query.error, query.isLoading, query.refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
};
