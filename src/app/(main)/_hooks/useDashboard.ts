import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview, DashboardOverviewResponse } from '../_api/dashboard';
import { dashboardKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useDashboardOverview = () => {
  return useQuery<DashboardOverviewResponse, ApiError>({
    queryKey: dashboardKeys.overview(),
    queryFn: () => getDashboardOverview(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
