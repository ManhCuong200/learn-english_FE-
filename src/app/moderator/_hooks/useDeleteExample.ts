import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteExample } from '../_api/examples';
import { toast } from 'sonner';

export const useDeleteExample = (wordId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExample(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples', wordId] });
      queryClient.invalidateQueries({ queryKey: ['words', wordId] });
      toast.success('Example deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete example');
    },
  });
};
