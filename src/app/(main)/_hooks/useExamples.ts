import { useQuery } from '@tanstack/react-query';
import { getExamples } from '../_api/examples';
import { Example } from '@/types/example';
import { wordKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useExamples = (wordId: string) => {
  return useQuery<Example[], ApiError>({
    queryKey: wordKeys.examples(wordId),
    queryFn: () => getExamples(wordId),
    enabled: !!wordId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
