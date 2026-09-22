import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../_api/categories';
import { Category } from '@/types/category';

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};
