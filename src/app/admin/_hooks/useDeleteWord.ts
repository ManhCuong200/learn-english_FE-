import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWord } from '../_api/words';
import { adminQueryKeys } from '@/lib/adminQueryKeys';
import { toast } from 'sonner';

export const useDeleteWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      toast.success('Word deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete word.');
    },
  });
};
