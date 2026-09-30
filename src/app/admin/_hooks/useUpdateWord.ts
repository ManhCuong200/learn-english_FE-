import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWord } from '../_api/words';
import { adminKeys, wordKeys } from '@/lib/queryKeys';
import { UpdateWordRequest, Word } from '@/types/word';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';

export const useUpdateWord = () => {
  const queryClient = useQueryClient();

  return useMutation<Word, ApiError, { id: string; data: UpdateWordRequest }>({
    mutationFn: ({ id, data }) => updateWord(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: wordKeys.all });
      queryClient.invalidateQueries({ queryKey: wordKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('Word updated successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update word.');
    },
  });
};
