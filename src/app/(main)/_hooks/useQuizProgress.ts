import { useQuery } from '@tanstack/react-query';
import { getQuizProgress } from '../_api/progress';
import { QuizProgress } from '@/types/progress';
import { progressKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useQuizProgress = () => {
  return useQuery<QuizProgress, ApiError>({
    queryKey: progressKeys.quiz(),
    queryFn: getQuizProgress,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
