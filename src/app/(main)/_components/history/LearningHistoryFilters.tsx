'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LearningActivityType } from '@/types/learning-history';

type FilterOption = {
  label: string;
  value: LearningActivityType | 'ALL';
};

const FILTERS: FilterOption[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Vocabulary', value: 'VOCABULARY' },
  { label: 'Flashcard', value: 'FLASHCARD' },
  { label: 'Quiz', value: 'QUIZ' },
];

export const LearningHistoryFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentType = (searchParams.get('type') as LearningActivityType | 'ALL') || 'ALL';

  const handleFilterChange = (type: LearningActivityType | 'ALL') => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 1 when filter changes
    params.set('page', '1');
    
    if (type === 'ALL') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((filter) => {
        const isActive = currentType === filter.value;
        return (
          <Button
            key={filter.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange(filter.value)}
            className={`rounded-full px-5 ${isActive ? 'font-bold' : 'font-medium text-muted-foreground'}`}
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
};
