import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWord } from '../_api/words';
import { toast } from 'sonner';

export const useCreateWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      toast.success('Word created successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create word.');
    },
  });
};
