import { useQuery } from '@tanstack/react-query';
import { getQuiz } from '../_api/quizzes';
import { QuizDetail } from '@/types/quiz';
import { quizKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useQuiz = (quizId?: string) => {
  return useQuery<QuizDetail, ApiError>({
    queryKey: quizKeys.detail(quizId ?? ''),
    queryFn: () => getQuiz(quizId!),
    enabled: Boolean(quizId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
