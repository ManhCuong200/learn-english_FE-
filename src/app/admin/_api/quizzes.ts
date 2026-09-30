import { apiFetch } from '@/api/client';
import type {
  AdminQuiz,
  AdminQuizListResponse,
  AdminQuizQueryParams,
  AdminQuizQuestion,
  CreateQuizQuestionRequest,
  CreateQuizRequest,
  UpdateQuizQuestionRequest,
  UpdateQuizRequest,
} from '@/types/quiz';

export const getAdminQuizzes = async (
  queryParams?: AdminQuizQueryParams,
): Promise<AdminQuizListResponse> => {
  const params = new URLSearchParams();
  if (queryParams?.search) params.append('search', queryParams.search);
  if (queryParams?.categoryId) params.append('categoryId', queryParams.categoryId);
  if (queryParams?.level) params.append('level', queryParams.level);
  if (queryParams?.page) params.append('page', String(queryParams.page));
  if (queryParams?.limit) params.append('limit', String(queryParams.limit));

  const queryString = params.toString();
  const endpoint = queryString ? `/quizzes/admin?${queryString}` : '/quizzes/admin';

  return apiFetch<AdminQuizListResponse>(endpoint, {
    method: 'GET',
  });
};

export const getAdminQuiz = async (id: string): Promise<AdminQuiz> => {
  return apiFetch<AdminQuiz>(`/quizzes/${id}`, {
    method: 'GET',
  });
};

export const createQuiz = async (data: CreateQuizRequest): Promise<AdminQuiz> => {
  return apiFetch<AdminQuiz>('/quizzes', {
    method: 'POST',
    body: data,
  });
};

export const updateQuiz = async (
  id: string,
  data: UpdateQuizRequest,
): Promise<AdminQuiz> => {
  return apiFetch<AdminQuiz>(`/quizzes/${id}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deleteQuiz = async (id: string): Promise<void> => {
  return apiFetch<void>(`/quizzes/${id}`, {
    method: 'DELETE',
  });
};

export const createQuizQuestion = async (
  quizId: string,
  data: CreateQuizQuestionRequest,
): Promise<AdminQuizQuestion> => {
  return apiFetch<AdminQuizQuestion>(`/quizzes/${quizId}/questions`, {
    method: 'POST',
    body: data,
  });
};

export const updateQuizQuestion = async (
  questionId: string,
  data: UpdateQuizQuestionRequest,
): Promise<AdminQuizQuestion> => {
  return apiFetch<AdminQuizQuestion>(`/quizzes/questions/${questionId}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deleteQuizQuestion = async (questionId: string): Promise<void> => {
  return apiFetch<void>(`/quizzes/questions/${questionId}`, {
    method: 'DELETE',
  });
};
