import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExample } from '../_api/examples';
import { toast } from 'sonner';

export const useUpdateExample = (wordId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateExample>[1] }) =>
      updateExample(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples', wordId] });
      queryClient.invalidateQueries({ queryKey: ['words', wordId] });
      toast.success('Example updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update example');
    },
  });
};
