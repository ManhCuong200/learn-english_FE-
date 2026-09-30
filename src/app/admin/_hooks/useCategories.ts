import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../_api/categories';
import { Category } from '@/types/category';
import { adminKeys, categoryKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useCategories = () => {
  return useQuery<Category[], ApiError>({
    queryKey: adminKeys.categories(),
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
