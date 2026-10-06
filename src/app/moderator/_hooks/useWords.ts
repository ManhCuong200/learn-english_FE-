import { useQuery } from '@tanstack/react-query';
import { getWords } from '../_api/words';
import { Word, WordQuery } from '@/types/word';
import { moderatorKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useWords = (query?: WordQuery) => {
  return useQuery<Word[], ApiError>({
    queryKey: moderatorKeys.words(query as Record<string, unknown>),
    queryFn: () => getWords(query),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
