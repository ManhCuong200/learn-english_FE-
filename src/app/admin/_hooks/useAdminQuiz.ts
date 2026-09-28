import { useQuery } from '@tanstack/react-query';
import { getAdminQuiz } from '../_api/quizzes';

export const useAdminQuiz = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['admin', 'quiz', id],
    queryFn: () => getAdminQuiz(id),
    enabled: Boolean(id) && enabled,
  });
};
