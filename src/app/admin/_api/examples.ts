import { apiFetch } from '@/api/client';
import { CreateExampleRequest, Example, UpdateExampleRequest } from '@/types/example';

export const getExamples = async (wordId: string): Promise<Example[]> => {
  return apiFetch<Example[]>(`/words/${wordId}/examples`, {
    method: 'GET',
  });
};

export const createExample = async (wordId: string, data: CreateExampleRequest): Promise<Example> => {
  return apiFetch<Example>(`/words/${wordId}/examples`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateExample = async (id: string, data: UpdateExampleRequest): Promise<Example> => {
  return apiFetch<Example>(`/examples/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteExample = async (id: string): Promise<void> => {
  return apiFetch<void>(`/examples/${id}`, {
    method: 'DELETE',
  });
};
