'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/app/(auth)/_api/auth';
import { authQueryKey } from '@/lib/queryKeys';

export const useAuth = () => {
  const query = useQuery({
    queryKey: authQueryKey,
    queryFn: getCurrentUser,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    error: query.error,
  };
};