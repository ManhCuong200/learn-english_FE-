'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { getCurrentUser } from '@/app/(auth)/_api/auth';
import { moderatorQueryKeys } from '@/lib/moderatorQueryKeys';
import type { AuthUser } from '@/types/auth';

type ModeratorAuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  clearSession: () => void;
};

const ModeratorAuthContext = createContext<ModeratorAuthContextValue | undefined>(undefined);

export const ModeratorAuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isLoginPage = pathname === '/moderator/login';
  const query = useQuery<AuthUser>({
    queryKey: moderatorQueryKeys.auth,
    queryFn: getCurrentUser,
    retry: false,
    enabled: !isLoginPage,
    staleTime: 5 * 60 * 1000,
  });
  const isFetching = query.isFetching || query.isLoading || query.isPending;
  const isAuthenticated = !isLoginPage && query.data?.role === 'MODERATOR';

  const value = useMemo<ModeratorAuthContextValue>(
    () => ({
      isLoading: !isLoginPage && isFetching,
      isAuthenticated,
      clearSession: () => {
        queryClient.removeQueries({ queryKey: moderatorQueryKeys.auth });
        queryClient.removeQueries({ queryKey: moderatorQueryKeys.all });
      },
    }),
    [isAuthenticated, isFetching, isLoginPage, queryClient],
  );

  return <ModeratorAuthContext.Provider value={value}>{children}</ModeratorAuthContext.Provider>;
};

export const useModeratorAuthContext = () => {
  const context = useContext(ModeratorAuthContext);

  if (!context) {
    throw new Error('useModeratorAuthContext must be used within ModeratorAuthProvider');
  }

  return context;
};
