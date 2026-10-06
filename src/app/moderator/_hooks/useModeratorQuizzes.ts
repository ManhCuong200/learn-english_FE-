import { useQuery } from '@tanstack/react-query';
import { getModeratorQuizzes } from '../_api/quizzes';
import type { ModeratorQuizQueryParams, ModeratorQuizListResponse } from '@/types/quiz';
import { moderatorKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useModeratorQuizzes = (queryParams?: ModeratorQuizQueryParams) => {
  return useQuery<ModeratorQuizListResponse, ApiError>({
    queryKey: moderatorKeys.quizzes(queryParams as Record<string, unknown>),
    queryFn: () => getModeratorQuizzes(queryParams),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
