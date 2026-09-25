import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExample } from '../_api/examples';
import { toast } from 'sonner';

export const useCreateExample = (wordId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createExample>[1]) => createExample(wordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples', wordId] });
      queryClient.invalidateQueries({ queryKey: ['words', wordId] });
      toast.success('Example created successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to create example');
    },
  });
};
