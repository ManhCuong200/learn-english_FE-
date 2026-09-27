import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWords, markWordAsLearned } from '../_api/words';
import { WordQuery } from '@/types/word';

export const useWords = (query?: WordQuery) => {
  return useQuery({
    queryKey: ['learner-words', query],
    queryFn: () => getWords(query),
  });
};

export const useMarkWordAsLearned = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wordId: string) => markWordAsLearned(wordId),
    onSuccess: (_, wordId) => {
      queryClient.invalidateQueries({ queryKey: ['learner-words'] });
      queryClient.invalidateQueries({ queryKey: ['learner-word', wordId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
    },
  });
};
