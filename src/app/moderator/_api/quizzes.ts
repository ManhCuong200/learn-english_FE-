import { apiFetch } from '@/api/client';
import type {
  ModeratorQuiz,
  ModeratorQuizListResponse,
  ModeratorQuizQueryParams,
  ModeratorQuizQuestion,
  CreateQuizQuestionRequest,
  CreateQuizRequest,
  UpdateQuizQuestionRequest,
  UpdateQuizRequest,
} from '@/types/quiz';

export const getModeratorQuizzes = async (
  queryParams?: ModeratorQuizQueryParams,
): Promise<ModeratorQuizListResponse> => {
  const params = new URLSearchParams();
  if (queryParams?.search) params.append('search', queryParams.search);
  if (queryParams?.categoryId) params.append('categoryId', queryParams.categoryId);
  if (queryParams?.level) params.append('level', queryParams.level);
  if (queryParams?.page) params.append('page', String(queryParams.page));
  if (queryParams?.limit) params.append('limit', String(queryParams.limit));

  const queryString = params.toString();
  const endpoint = queryString ? `/quizzes/moderator?${queryString}` : '/quizzes/moderator';

  return apiFetch<ModeratorQuizListResponse>(endpoint, {
    method: 'GET',
  });
};

export const getModeratorQuiz = async (id: string): Promise<ModeratorQuiz> => {
  return apiFetch<ModeratorQuiz>(`/quizzes/${id}`, {
    method: 'GET',
  });
};

export const createQuiz = async (data: CreateQuizRequest): Promise<ModeratorQuiz> => {
  return apiFetch<ModeratorQuiz>('/quizzes', {
    method: 'POST',
    body: data,
  });
};

export const updateQuiz = async (
  id: string,
  data: UpdateQuizRequest,
): Promise<ModeratorQuiz> => {
  return apiFetch<ModeratorQuiz>(`/quizzes/${id}`, {
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
): Promise<ModeratorQuizQuestion> => {
  return apiFetch<ModeratorQuizQuestion>(`/quizzes/${quizId}/questions`, {
    method: 'POST',
    body: data,
  });
};

export const updateQuizQuestion = async (
  questionId: string,
  data: UpdateQuizQuestionRequest,
): Promise<ModeratorQuizQuestion> => {
  return apiFetch<ModeratorQuizQuestion>(`/quizzes/questions/${questionId}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deleteQuizQuestion = async (questionId: string): Promise<void> => {
  return apiFetch<void>(`/quizzes/questions/${questionId}`, {
    method: 'DELETE',
  });
};
