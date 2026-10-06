import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuizQuestion } from '../_api/quizzes';
import type { CreateQuizQuestionRequest } from '@/types/quiz';
import { toast } from 'sonner';

export const useCreateQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      data,
    }: {
      quizId: string;
      data: CreateQuizQuestionRequest;
    }) => createQuizQuestion(quizId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moderator', 'quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['moderator', 'quiz', variables.quizId] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create question.');
    },
  });
};
