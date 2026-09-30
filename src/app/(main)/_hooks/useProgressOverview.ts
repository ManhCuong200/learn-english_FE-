import { useQuery } from '@tanstack/react-query';
import { getProgressOverview } from '../_api/progress';
import { ProgressOverview } from '@/types/progress';
import { progressKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useProgressOverview = () => {
  return useQuery<ProgressOverview, ApiError>({
    queryKey: progressKeys.overview(),
    queryFn: getProgressOverview,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
