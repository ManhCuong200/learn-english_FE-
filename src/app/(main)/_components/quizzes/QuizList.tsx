'use client';

import { QuizSummary } from '@/types/quiz';
import { QuizCard } from '@/app/(main)/_components/quizzes/QuizCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileQuestion, AlertCircle, RefreshCw } from 'lucide-react';

interface QuizListProps {
  quizzes?: QuizSummary[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export const QuizList = ({
  quizzes,
  isLoading,
  isError,
  onRetry,
  onClearFilters,
}: QuizListProps) => {
  // Loading Skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-border p-6 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center my-6">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-bold text-foreground">Something went wrong</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          Failed to load quizzes. Please check your internet connection or try again.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-6 rounded-xl gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    );
  }

  // Empty State
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center my-6">
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <FileQuestion className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No quizzes available</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          We couldn&apos;t find any quizzes matching your selected criteria. Try another category or level.
        </p>
        {onClearFilters && (
          <Button onClick={onClearFilters} variant="secondary" className="mt-6 rounded-xl">
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  // Quiz Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};
