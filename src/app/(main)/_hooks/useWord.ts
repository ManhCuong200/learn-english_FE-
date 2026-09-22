import { useQuery } from '@tanstack/react-query';
import { getWord } from '../_api/words';

export const useWord = (id: string) => {
  return useQuery({
    queryKey: ['learner-words', id],
    queryFn: () => getWord(id),
    enabled: !!id,
  });
};
