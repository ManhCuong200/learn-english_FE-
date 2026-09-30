import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '../_api/quizzes';
import { QuizListResponse } from '@/types/quiz';
import { quizKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useQuizzes = (params?: { categoryId?: string; level?: string }) => {
  return useQuery<QuizListResponse, ApiError>({
    queryKey: quizKeys.list(params),
    queryFn: () => getQuizzes(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
