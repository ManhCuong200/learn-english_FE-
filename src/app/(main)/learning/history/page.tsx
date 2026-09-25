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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-12">
      <div className="relative overflow-hidden bg-background pt-16 md:pt-24 pb-12 border-b">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 -translate-y-12 translate-x-1/3 right-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]"></div>
        
        <div className="relative mx-auto max-w-5xl px-6 sm:px-10 lg:px-12">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="mr-2 h-4 w-4" />
            Your journey
          </div>
          <div className="flex items-center gap-4 mb-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#e3eee7] text-primary">
              <History className="size-7" />
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Learning History
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Track your learning activities and progress. See what you've accomplished and where you're heading.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-12 py-10">
        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
            Filter activities
          </h2>
          <LearningHistoryFilters />
        </div>

        <div className="mt-8 animate-in fade-in duration-1000 delay-300">
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
