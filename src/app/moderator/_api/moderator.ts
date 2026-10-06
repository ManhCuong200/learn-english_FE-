import { apiFetch } from '@/api/client';
import type {
  ModeratorCategory,
  ModeratorListResponse,
  ModeratorLoginRequest,
  ModeratorLoginResponse,
  ModeratorWord,
  CategoryInput,
  WordInput,
} from '@/types/moderator';

const moderatorApi = {
  login: (request: ModeratorLoginRequest) =>
    apiFetch<ModeratorLoginResponse>('/auth/moderator/login', {
      method: 'POST',
      body: request,
    }),
  logout: () =>
    apiFetch<{ message?: string }>('/auth/logout', {
      method: 'POST',
    }),
  getCategories: async () => {
    const response = await apiFetch<ModeratorListResponse<ModeratorCategory>>('/categories');
    return Array.isArray(response) ? response : response.data;
  },
  getWords: async (search?: string) => {
    const endpoint = search ? `/words/search?q=${encodeURIComponent(search)}` : '/words';
    const response = await apiFetch<ModeratorListResponse<ModeratorWord>>(endpoint);
    return Array.isArray(response) ? response : response.data;
  },
  createCategory: (input: CategoryInput) =>
    apiFetch<ModeratorCategory>('/categories', {
      method: 'POST',
      body: input,
    }),
  updateCategory: (id: string, input: CategoryInput) =>
    apiFetch<ModeratorCategory>(`/categories/${id}`, {
      method: 'PATCH',
      body: input,
    }),
  deleteCategory: (id: string) => apiFetch<void>(`/categories/${id}`, { method: 'DELETE' }),
  createWord: (input: WordInput) =>
    apiFetch<ModeratorWord>('/words', {
      method: 'POST',
      body: input,
    }),
  updateWord: (id: string, input: WordInput) =>
    apiFetch<ModeratorWord>(`/words/${id}`, {
      method: 'PATCH',
      body: input,
    }),
  deleteWord: (id: string) => apiFetch<void>(`/words/${id}`, { method: 'DELETE' }),
};

export const moderatorLogin = moderatorApi.login;
export const moderatorLogout = moderatorApi.logout;
export const getCategories = moderatorApi.getCategories;
export const getWords = moderatorApi.getWords;
export const createCategory = moderatorApi.createCategory;
export const updateCategory = moderatorApi.updateCategory;
export const deleteCategory = moderatorApi.deleteCategory;
export const createWord = moderatorApi.createWord;
export const updateWord = moderatorApi.updateWord;
export const deleteWord = moderatorApi.deleteWord;

