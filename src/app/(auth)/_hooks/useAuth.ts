'use client';

import { useQuery } from '@tanstack/react-query';
import { authQueryOptions } from '@/lib/authQuery';

export const useAuth = () => {
  const query = useQuery(authQueryOptions());
  const isLearnerUser = query.data?.role === 'USER';

  return {
    user: isLearnerUser ? query.data! : null,
    isLoading: query.isLoading,
    isAuthenticated: isLearnerUser,
    error: query.error,
  };
};