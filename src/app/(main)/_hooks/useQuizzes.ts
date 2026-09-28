import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '../_api/quizzes';
import { QuizListResponse } from '@/types/quiz';

export const useQuizzes = (params?: { categoryId?: string; level?: string }) => {
  return useQuery<QuizListResponse, Error>({
    queryKey: ['quizzes', params],
    queryFn: () => getQuizzes(params),
  });
};
