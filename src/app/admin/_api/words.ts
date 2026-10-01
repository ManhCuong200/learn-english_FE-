import { CreateWordRequest, UpdateWordRequest, Word, WordQuery } from '@/types/word';
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

export const createWord = async (data: CreateWordRequest): Promise<Word> => {
  return apiFetch<Word>('/words', {
    method: 'POST',
    body: data,
  });
};

export const updateWord = async (id: string, data: UpdateWordRequest): Promise<Word> => {
  return apiFetch<Word>(`/words/${id}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deleteWord = async (id: string): Promise<void> => {
  return apiFetch<void>(`/words/${id}`, {
    method: 'DELETE',
  });
};

export const fetchWordInfo = async (word: string) => {
  return apiFetch<{
    word: string;
    meaning: string;
    ipa: string | null;
    level: string;
    examples: { content: string; meaning: string | null }[];
  }>(`/words/fetch-info?word=${encodeURIComponent(word)}`);
};

export const bulkCrawlWords = async (data: { words: string[]; categoryId: string }) => {
  return apiFetch<{
    message: string;
    successCount: number;
    failedCount: number;
    total: number;
    words: Word[];
  }>('/words/bulk-crawl', {
    method: 'POST',
    body: data,
  });
};

export const extractWordsFromPdf = async (data: {
  base64: string;
  fileName?: string;
}) => {
  return apiFetch<import('@/types/word-ai').ExtractPdfResponse>(
    '/words/ai/extract-pdf',
    {
      method: 'POST',
      body: data,
    },
  );
};

export const importExtractedWords = async (data: {
  categories: import('@/types/word-ai').ExtractedCategoryItem[];
}) => {
  return apiFetch<import('@/types/word-ai').ImportExtractedResponse>(
    '/words/ai/import-extracted',
    {
      method: 'POST',
      body: data,
    },
  );
};

