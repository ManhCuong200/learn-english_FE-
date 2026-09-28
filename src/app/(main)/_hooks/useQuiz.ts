import { useQuery } from '@tanstack/react-query';
import { getQuiz } from '../_api/quizzes';
import { QuizDetail } from '@/types/quiz';

export const useQuiz = (quizId?: string) => {
  return useQuery<QuizDetail, Error>({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuiz(quizId!),
    enabled: Boolean(quizId),
  });
};
