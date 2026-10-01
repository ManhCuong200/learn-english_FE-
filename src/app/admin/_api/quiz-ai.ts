import { apiFetch } from '@/api/client';
import type {
  GenerateQuizQuestionsRequest,
  GenerateQuizQuestionsResponse,
  RegenerateQuizQuestionRequest,
  RegenerateQuizQuestionResponse,
} from '@/types/quiz-ai';

export const generateQuizQuestions = async (
  payload: GenerateQuizQuestionsRequest,
): Promise<GenerateQuizQuestionsResponse> => {
  return apiFetch<GenerateQuizQuestionsResponse>('/quizzes/ai/generate', {
    method: 'POST',
    body: payload,
  });
};

export const regenerateQuizQuestion = async (
  payload: RegenerateQuizQuestionRequest,
): Promise<RegenerateQuizQuestionResponse> => {
  return apiFetch<RegenerateQuizQuestionResponse>('/quizzes/ai/regenerate', {
    method: 'POST',
    body: payload,
  });
};

