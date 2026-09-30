import { useQuery } from '@tanstack/react-query';
import { getWord } from '../_api/words';
import { Word } from '@/types/word';
import { wordKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useWord = (id: string) => {
  return useQuery<Word, ApiError>({
    queryKey: wordKeys.detail(id),
    queryFn: () => getWord(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
