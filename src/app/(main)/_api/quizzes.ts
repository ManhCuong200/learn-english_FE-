import { apiFetch } from '@/api/client';
import {
  QuizAttempt,
  QuizDetail,
  QuizListResponse,
  QuizStartResponse,
  QuizSubmitRequest,
  QuizSubmitResponse,
} from '@/types/quiz';

export async function getQuizzes(params?: {
  categoryId?: string;
  level?: string;
}): Promise<QuizListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) {
    searchParams.set('categoryId', params.categoryId);
  }
  if (params?.level) {
    searchParams.set('level', params.level);
  }

  const query = searchParams.toString();
  const endpoint = `/quizzes${query ? `?${query}` : ''}`;

  return apiFetch<QuizListResponse>(endpoint, {
    method: 'GET',
  });
}

export async function getQuiz(quizId: string): Promise<QuizDetail> {
  return apiFetch<QuizDetail>(`/quizzes/${quizId}`, {
    method: 'GET',
  });
}

export async function startQuiz(quizId: string): Promise<QuizStartResponse> {
  return apiFetch<QuizStartResponse>(`/quizzes/${quizId}/start`, {
    method: 'POST',
  });
}

export async function submitQuiz(
  attemptId: string,
  data: QuizSubmitRequest,
): Promise<QuizSubmitResponse> {
  return apiFetch<QuizSubmitResponse>(`/quizzes/attempts/${attemptId}/submit`, {
    method: 'POST',
    body: data,
  });
}

export async function getQuizAttempt(attemptId: string): Promise<QuizAttempt> {
  return apiFetch<QuizAttempt>(`/quizzes/attempts/${attemptId}`, {
    method: 'GET',
  });
}
