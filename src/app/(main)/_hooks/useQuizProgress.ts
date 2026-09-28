import { useQuery } from '@tanstack/react-query';
import { getQuizProgress } from '../_api/progress';
import { QuizProgress } from '@/types/progress';

export const useQuizProgress = () => {
  return useQuery<QuizProgress, Error>({
    queryKey: ['progress', 'quizzes'],
    queryFn: getQuizProgress,
  });
};
