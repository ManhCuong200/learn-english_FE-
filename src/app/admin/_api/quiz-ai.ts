import { apiFetch } from '@/api/client';
import type {
  GenerateQuizQuestionsRequest,
  GenerateQuizQuestionsResponse,
} from '@/types/quiz-ai';

export const generateQuizQuestions = async (
  payload: GenerateQuizQuestionsRequest,
): Promise<GenerateQuizQuestionsResponse> => {
  return apiFetch<GenerateQuizQuestionsResponse>('/quizzes/ai/generate', {
    method: 'POST',
    body: payload,
  });
};
