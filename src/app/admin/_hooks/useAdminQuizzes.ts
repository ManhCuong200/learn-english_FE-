import { useQuery } from '@tanstack/react-query';
import { getAdminQuizzes } from '../_api/quizzes';
import type { AdminQuizQueryParams } from '@/types/quiz';

export const useAdminQuizzes = (queryParams?: AdminQuizQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'quizzes', queryParams],
    queryFn: () => getAdminQuizzes(queryParams),
  });
};
