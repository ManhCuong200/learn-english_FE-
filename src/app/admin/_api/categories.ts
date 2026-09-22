import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category';
import { apiFetch } from '@/api/client';

export const getCategories = async (): Promise<Category[]> => {
  return apiFetch<Category[]>('/categories', {
    method: 'GET',
  });
};

export const getCategory = async (id: string): Promise<Category> => {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'GET',
  });
};

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (id: string): Promise<void> => {
  return apiFetch<void>(`/categories/${id}`, {
    method: 'DELETE',
  });
};
