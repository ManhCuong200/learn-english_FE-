import { useQuery } from '@tanstack/react-query';
import { getProgressOverview } from '../_api/progress';
import { ProgressOverview } from '@/types/progress';

export const useProgressOverview = () => {
  return useQuery<ProgressOverview, Error>({
    queryKey: ['progress', 'overview'],
    queryFn: getProgressOverview,
  });
};
