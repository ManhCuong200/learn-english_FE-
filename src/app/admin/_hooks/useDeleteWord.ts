import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWord } from '../_api/words';
import { adminKeys, wordKeys } from '@/lib/queryKeys';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';

export const useDeleteWord = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wordKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('Word deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete word.');
    },
  });
};
