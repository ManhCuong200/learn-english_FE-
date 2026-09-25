import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '../_api/dashboard';

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => getDashboardOverview(),
  });
};
