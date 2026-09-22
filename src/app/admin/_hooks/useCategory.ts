import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../_api/categories';
import { Category } from '@/types/category';

export const useCategory = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: ['categories', id],
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
};
