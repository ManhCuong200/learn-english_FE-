import { useQuery } from '@tanstack/react-query';
import { getWords } from '../_api/words';
import { WordQuery } from '@/types/word';

export const useWords = (query?: WordQuery) => {
  return useQuery({
    queryKey: ['words', query],
    queryFn: () => getWords(query),
  });
};
