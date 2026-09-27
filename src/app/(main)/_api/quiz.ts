import { apiFetch } from '@/api/client';
import { QuizAnswerItem, QuizQuestion, QuizSubmitResult } from '@/types/quiz';

export const getQuizQuestions = async (limit = 5): Promise<{ data: QuizQuestion[] }> => {
  return apiFetch<{ data: QuizQuestion[] }>(`/quiz/questions?limit=${limit}`, {
    method: 'GET',
  });
};

export const submitQuiz = async (answers: QuizAnswerItem[]): Promise<QuizSubmitResult> => {
  return apiFetch<QuizSubmitResult>('/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
};
