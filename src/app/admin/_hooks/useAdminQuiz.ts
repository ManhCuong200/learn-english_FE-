import { useQuery } from '@tanstack/react-query';
import { getAdminQuiz } from '../_api/quizzes';
import type { AdminQuiz } from '@/types/quiz';
import { adminKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useAdminQuiz = (id: string, enabled = true) => {
  return useQuery<AdminQuiz, ApiError>({
    queryKey: adminKeys.quizDetail(id),
    queryFn: () => getAdminQuiz(id),
    enabled: Boolean(id) && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
