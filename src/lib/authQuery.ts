import { queryOptions } from '@tanstack/react-query';
import { getCurrentUser } from '@/app/(auth)/_api/auth';
import { authKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const authQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (TanStack Query v5)
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }
      return failureCount < 1;
    },
  });
