import { useQuery } from '@tanstack/react-query';
import { getAdminQuizzes } from '../_api/quizzes';
import type { AdminQuizQueryParams, AdminQuizListResponse } from '@/types/quiz';
import { adminKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useAdminQuizzes = (queryParams?: AdminQuizQueryParams) => {
  return useQuery<AdminQuizListResponse, ApiError>({
    queryKey: adminKeys.quizzes(queryParams as Record<string, unknown>),
    queryFn: () => getAdminQuizzes(queryParams),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
