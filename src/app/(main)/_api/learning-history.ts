import { apiFetch } from '@/api/client';
import type { LearningHistoryParams, LearningHistoryResponse } from '@/types/learning-history';

export const getLearningHistory = async (
  params?: LearningHistoryParams
): Promise<LearningHistoryResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }
  if (params?.type && params.type !== 'ALL') {
    searchParams.append('type', params.type);
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/learning-history?${queryString}` : '/learning-history';

  return apiFetch<LearningHistoryResponse>(endpoint);
};

export const recordLearningHistory = async (
  payload: import('@/types/learning-history').CreateLearningHistoryPayload
): Promise<void> => {
  return apiFetch<void>('/learning-history', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
