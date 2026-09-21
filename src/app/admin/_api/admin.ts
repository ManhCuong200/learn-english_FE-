import { apiFetch } from '@/api/client';
import type {
  AdminCategory,
  AdminListResponse,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminWord,
  CategoryInput,
  WordInput,
} from '@/types/admin';

const adminApi = {
  login: (request: AdminLoginRequest) =>
    apiFetch<AdminLoginResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  logout: () =>
    apiFetch<{ message?: string }>('/auth/logout', {
      method: 'POST',
    }),
  getCategories: async () => {
    const response = await apiFetch<AdminListResponse<AdminCategory>>('/categories');
    return Array.isArray(response) ? response : response.data;
  },
  getWords: async (search?: string) => {
    const endpoint = search ? `/words/search?q=${encodeURIComponent(search)}` : '/words';
    const response = await apiFetch<AdminListResponse<AdminWord>>(endpoint);
    return Array.isArray(response) ? response : response.data;
  },
  createCategory: (input: CategoryInput) =>
    apiFetch<AdminCategory>('/categories', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateCategory: (id: string, input: CategoryInput) =>
    apiFetch<AdminCategory>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  deleteCategory: (id: string) => apiFetch<void>(`/categories/${id}`, { method: 'DELETE' }),
  createWord: (input: WordInput) =>
    apiFetch<AdminWord>('/words', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateWord: (id: string, input: WordInput) =>
    apiFetch<AdminWord>(`/words/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  deleteWord: (id: string) => apiFetch<void>(`/words/${id}`, { method: 'DELETE' }),
};

export const adminLogin = adminApi.login;
export const adminLogout = adminApi.logout;
export const getCategories = adminApi.getCategories;
export const getWords = adminApi.getWords;
export const createCategory = adminApi.createCategory;
export const updateCategory = adminApi.updateCategory;
export const deleteCategory = adminApi.deleteCategory;
export const createWord = adminApi.createWord;
export const updateWord = adminApi.updateWord;
export const deleteWord = adminApi.deleteWord;

