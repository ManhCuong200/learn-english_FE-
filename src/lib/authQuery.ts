import { queryOptions } from '@tanstack/react-query';

import { getCurrentUser } from '@/app/(auth)/_api/auth';
import { authQueryKey } from '@/lib/queryKeys';

export const authQueryOptions = () =>
  queryOptions({
    queryKey: authQueryKey,
    queryFn: getCurrentUser,
    staleTime: 60_000,
    retry: (failureCount, error) => {
      if (error instanceof Error && 'status' in error) {
        const status = Number((error as { status?: number }).status);
        if (status === 401 || status === 403) {
          return false;
        }
      }

      return failureCount < 1;
    },
  });
