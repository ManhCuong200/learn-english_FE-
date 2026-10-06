import { useMutation } from '@tanstack/react-query';
import { generateQuizQuestions } from '../_api/quiz-ai';
import type {
  GenerateQuizQuestionsRequest,
  GenerateQuizQuestionsResponse,
} from '@/types/quiz-ai';
import { toast } from 'sonner';

export const useGenerateQuizQuestions = () => {
  return useMutation<
    GenerateQuizQuestionsResponse,
    Error,
    GenerateQuizQuestionsRequest
  >({
    mutationFn: generateQuizQuestions,
    onSuccess: (data) => {
      toast.success(
        `Generated ${data.questions.length} questions successfully with AI!`,
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate questions with AI.');
    },
  });
};
