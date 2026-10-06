import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWord } from '../_api/words';
import { moderatorKeys, wordKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';
import { Word, CreateWordRequest } from '@/types/word';
import { ApiError } from '@/lib/api-client';

export const useCreateWord = () => {
  const queryClient = useQueryClient();

  return useMutation<Word, ApiError, CreateWordRequest>({
    mutationFn: createWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wordKeys.all });
      queryClient.invalidateQueries({ queryKey: moderatorKeys.all });
      toast.success('Word created successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create word.');
    },
  });
};
