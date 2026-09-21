'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { getCurrentUser } from '@/app/(auth)/_api/auth';
import { adminQueryKeys } from '@/lib/adminQueryKeys';
import type { AuthUser } from '@/types/auth';

type AdminAuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  clearSession: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const query = useQuery<AuthUser>({
    queryKey: adminQueryKeys.all,
    queryFn: getCurrentUser,
    retry: false,
    enabled: !isLoginPage,
  });
  const isAuthenticated = !isLoginPage && query.data?.role === 'ADMIN';

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isLoading: !isLoginPage && query.isLoading,
      isAuthenticated,
      clearSession: () => {
        queryClient.removeQueries({ queryKey: adminQueryKeys.all });
      },
    }),
    [isAuthenticated, isLoginPage, query.isLoading, queryClient],
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
