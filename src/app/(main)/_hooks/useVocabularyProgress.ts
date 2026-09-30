import { useQuery } from '@tanstack/react-query';
import { getVocabularyProgress } from '../_api/progress';
import { VocabularyProgress } from '@/types/progress';
import { progressKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useVocabularyProgress = () => {
  return useQuery<VocabularyProgress, ApiError>({
    queryKey: progressKeys.vocabulary(),
    queryFn: getVocabularyProgress,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
