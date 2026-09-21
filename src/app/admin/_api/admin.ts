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

export const adminLogin = (request: AdminLoginRequest) => {
  return apiFetch<AdminLoginResponse>('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const adminLogout = () => {
  return apiFetch<{ message?: string }>('/auth/logout', {
    method: 'POST',
  });
};

export const getCategories = async () => {
  const response = await apiFetch<AdminListResponse<AdminCategory>>('/categories');
  return Array.isArray(response) ? response : response.data;
};

export const getWords = async (search?: string) => {
  const endpoint = search
    ? `/words/search?q=${encodeURIComponent(search)}`
    : '/words';
  const response = await apiFetch<AdminListResponse<AdminWord>>(endpoint);
  return Array.isArray(response) ? response : response.data;
};

export const createCategory = (input: CategoryInput) => {
  return apiFetch<AdminCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  });
};

export const updateCategory = (id: string, input: CategoryInput) => {
  return apiFetch<AdminCategory>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
};

export const deleteCategory = (id: string) => {
  return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' });
};

export const createWord = (input: WordInput) => {
  return apiFetch<AdminWord>('/words', {
    method: 'POST',
    body: JSON.stringify(input),
  });
};

export const updateWord = (id: string, input: WordInput) => {
  return apiFetch<AdminWord>(`/words/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
};

export const deleteWord = (id: string) => {
  return apiFetch<void>(`/words/${id}`, { method: 'DELETE' });
};
