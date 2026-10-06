import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuiz } from '../_api/quizzes';
import { toast } from 'sonner';

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderator', 'quizzes'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create quiz.');
    },
  });
};
