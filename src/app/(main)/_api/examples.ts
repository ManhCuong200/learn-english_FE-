import { apiFetch } from '@/api/client';
import { Example } from '@/types/example';

export const getExamples = async (wordId: string): Promise<Example[]> => {
  return apiFetch<Example[]>(`/words/${wordId}/examples`, {
    method: 'GET',
  });
};
