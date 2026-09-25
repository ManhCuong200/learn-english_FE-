'use client';

import { useSearchParams } from 'next/navigation';
import { useLearningHistory } from '../../_hooks/useLearningHistory';
import { LearningHistoryList } from '../../_components/LearningHistoryList';
import { LearningHistoryFilters } from '../../_components/LearningHistoryFilters';
import { Sparkles, History } from 'lucide-react';
import type { LearningActivityType } from '@/types/learning-history';

export default function LearningHistoryPage() {
  const searchParams = useSearchParams();
  
  const rawType = searchParams.get('type');
  const typeParam = rawType as LearningActivityType | 'ALL' | null;
  const isValidType = typeParam === 'VOCABULARY' || typeParam === 'FLASHCARD' || typeParam === 'QUIZ';
  const type = isValidType ? typeParam : undefined;
  
  const pageParam = searchParams.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const validPage = isNaN(page) || page < 1 ? 1 : page;

  const { data, isLoading, isError, refetch } = useLearningHistory({
    page: validPage,
    limit: 10,
    ...(type && { type }),
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-8">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">Your Journey</p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
          Learning History
        </h1>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-4">
            Filter activities
          </h2>
          <LearningHistoryFilters />
        </div>

        <div className="mt-8 animate-in fade-in duration-1000 delay-150">
          <LearningHistoryList 
            data={data}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            filterType={type || 'ALL'}
          />
        </div>
      </div>
    </div>
  );
}
