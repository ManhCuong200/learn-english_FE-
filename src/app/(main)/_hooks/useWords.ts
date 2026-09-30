import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWords, markWordAsLearned } from '../_api/words';
import { Word, WordQuery } from '@/types/word';
import { wordKeys, dashboardKeys, progressKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useWords = (query?: WordQuery) => {
  return useQuery<Word[], ApiError>({
    queryKey: wordKeys.list(query as Record<string, unknown>),
    queryFn: () => getWords(query),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useMarkWordAsLearned = () => {
  const queryClient = useQueryClient();
  return useMutation<unknown, ApiError, string>({
    mutationFn: (wordId: string) => markWordAsLearned(wordId),
    onSuccess: (_, wordId) => {
      queryClient.invalidateQueries({ queryKey: wordKeys.all });
      queryClient.invalidateQueries({ queryKey: wordKeys.detail(wordId) });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
};
