import { useQuery } from '@tanstack/react-query';
import { getQuizAttempt } from '../_api/quizzes';
import { QuizAttempt } from '@/types/quiz';
import { quizKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useQuizAttempt = (attemptId?: string) => {
  return useQuery<QuizAttempt, ApiError>({
    queryKey: quizKeys.attempt(attemptId ?? ''),
    queryFn: () => getQuizAttempt(attemptId!),
    enabled: Boolean(attemptId),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
