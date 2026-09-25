import { useQuery } from '@tanstack/react-query';
import { getExamples } from '../_api/examples';

export const useExamples = (wordId: string) => {
  return useQuery({
    queryKey: ['learner-examples', wordId],
    queryFn: () => getExamples(wordId),
    enabled: !!wordId,
  });
};
