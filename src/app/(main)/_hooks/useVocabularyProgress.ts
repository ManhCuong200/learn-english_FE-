import { useQuery } from '@tanstack/react-query';
import { getVocabularyProgress } from '../_api/progress';
import { VocabularyProgress } from '@/types/progress';

export const useVocabularyProgress = () => {
  return useQuery<VocabularyProgress, Error>({
    queryKey: ['progress', 'vocabulary'],
    queryFn: getVocabularyProgress,
  });
};
