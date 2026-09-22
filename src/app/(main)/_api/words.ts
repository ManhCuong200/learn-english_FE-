import { Word, WordQuery } from '@/types/word';
import { apiFetch } from '@/api/client';

export const getWords = async (query?: WordQuery): Promise<Word[]> => {
  let endpoint = '/words';
  
  if (query) {
    const params = new URLSearchParams();
    if (query.search) params.append('search', query.search);
    if (query.categoryId) params.append('categoryId', query.categoryId);
    if (query.level) params.append('level', query.level);
    
    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }

  return apiFetch<Word[]>(endpoint, {
    method: 'GET',
  });
};

export const getWord = async (id: string): Promise<Word> => {
  return apiFetch<Word>(`/words/${id}`, {
    method: 'GET',
  });
};
