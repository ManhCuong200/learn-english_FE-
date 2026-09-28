import { useQuery } from '@tanstack/react-query';
import { getProgressActivity } from '../_api/progress';
import { ProgressActivityResponse } from '@/types/progress';

export const useProgressActivity = (days = 7) => {
  return useQuery<ProgressActivityResponse, Error>({
    queryKey: ['progress', 'activity', days],
    queryFn: () => getProgressActivity(days),
  });
};
