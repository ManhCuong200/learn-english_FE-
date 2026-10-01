import { useMutation } from '@tanstack/react-query';
import { regenerateQuizQuestion } from '../_api/quiz-ai';
import type {
  RegenerateQuizQuestionRequest,
  RegenerateQuizQuestionResponse,
} from '@/types/quiz-ai';
import { toast } from 'sonner';

export const useRegenerateQuizQuestion = () => {
  return useMutation<
    RegenerateQuizQuestionResponse,
    Error,
    RegenerateQuizQuestionRequest
  >({
    mutationFn: regenerateQuizQuestion,
    onSuccess: () => {
      toast.success('Question regenerated successfully with AI!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to regenerate question with AI.');
    },
  });
};
