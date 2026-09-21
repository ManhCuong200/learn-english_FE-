'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { adminQueryKeys } from '@/lib/adminQueryKeys';

type AdminAuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  clearSession: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const isAuthenticated = !!queryClient.getQueryData(adminQueryKeys.all);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isLoading: false,
      isAuthenticated,
      clearSession: () => {
        queryClient.removeQueries({ queryKey: adminQueryKeys.all });
      },
    }),
    [isAuthenticated, queryClient],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider');
  }

  return context;
};
