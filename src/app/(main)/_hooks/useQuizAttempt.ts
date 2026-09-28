import { useQuery } from '@tanstack/react-query';
import { getQuizAttempt } from '../_api/quizzes';
import { QuizAttempt } from '@/types/quiz';

export const useQuizAttempt = (attemptId?: string) => {
  return useQuery<QuizAttempt, Error>({
    queryKey: ['quiz-attempt', attemptId],
    queryFn: () => getQuizAttempt(attemptId!),
    enabled: Boolean(attemptId),
  });
};
