'use client';

import { LearningHistoryItem } from './LearningHistoryItem';
import { LearningHistoryPagination } from './LearningHistoryPagination';
import type { LearningHistoryResponse, LearningActivityType } from '@/types/learning-history';

type LearningHistoryListProps = {
  data?: LearningHistoryResponse;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  filterType: LearningActivityType | 'ALL';
};

const getEmptyStateMessage = (filterType: LearningActivityType | 'ALL') => {
  switch (filterType) {
    case 'VOCABULARY':
      return 'No vocabulary activities found.';
    case 'FLASHCARD':
      return 'No flashcard activities found.';
    case 'QUIZ':
      return 'No quiz activities found.';
    default:
      return 'No learning activities yet.';
  }
};

const SkeletonItem = () => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-2xl border bg-card animate-pulse">
    <div className="shrink-0 w-12 h-12 rounded-xl bg-muted" />
    <div className="flex-1 min-w-0 w-full space-y-3 mt-1">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-muted rounded-md" />
        <div className="h-4 w-16 bg-muted rounded-md" />
      </div>
      <div className="h-5 w-3/4 bg-muted rounded-md" />
      <div className="h-4 w-full bg-muted rounded-md" />
      <div className="h-4 w-2/3 bg-muted rounded-md" />
    </div>
  </div>
);

export const LearningHistoryList = ({ 
  data, 
  isLoading, 
  isError, 
  onRetry,
  filterType
}: LearningHistoryListProps) => {
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonItem key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
        <p className="text-lg font-medium mb-4">Failed to load learning history.</p>
        <button 
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-full bg-destructive px-6 py-2 text-sm font-semibold text-white transition hover:bg-destructive/90"
        >
          Try again
        </button>
      </div>
    );
  }

  const items = data?.data || [];
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed bg-muted/30">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          {getEmptyStateMessage(filterType)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        {items.map((item) => (
          <LearningHistoryItem key={item.id} item={item} />
        ))}
      </div>
      
      {data?.meta && <LearningHistoryPagination meta={data.meta} />}
    </div>
  );
};
