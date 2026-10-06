import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuiz } from '../_api/quizzes';
import type { UpdateQuizRequest } from '@/types/quiz';
import { toast } from 'sonner';

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuizRequest }) =>
      updateQuiz(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moderator', 'quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['moderator', 'quiz', variables.id] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update quiz.');
    },
  });
};
