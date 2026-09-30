import { useQuery } from '@tanstack/react-query';
import { getProgressActivity } from '../_api/progress';
import { ProgressActivityResponse } from '@/types/progress';
import { progressKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useProgressActivity = (days = 7) => {
  return useQuery<ProgressActivityResponse, ApiError>({
    queryKey: progressKeys.activity(days),
    queryFn: () => getProgressActivity(days),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
