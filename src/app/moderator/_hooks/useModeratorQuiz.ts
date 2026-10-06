import { useQuery } from '@tanstack/react-query';
import { getModeratorQuiz } from '../_api/quizzes';
import type { ModeratorQuiz } from '@/types/quiz';
import { moderatorKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useModeratorQuiz = (id: string, enabled = true) => {
  return useQuery<ModeratorQuiz, ApiError>({
    queryKey: moderatorKeys.quizDetail(id),
    queryFn: () => getModeratorQuiz(id),
    enabled: Boolean(id) && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
