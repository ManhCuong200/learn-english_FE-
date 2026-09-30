'use client';

import { useFlashcardProgress } from '@/app/(main)/_hooks/useFlashcardProgress';
import { Skeleton } from '@/components/ui/skeleton';
import { Layers, AlertCircle } from 'lucide-react';
import { FlashcardReviewResult } from '@/types/progress';

const RESULT_CONFIG: Record<
  FlashcardReviewResult,
  { label: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  AGAIN: {
    label: 'Again',
    colorClass: 'text-rose-500',
    bgClass: 'bg-rose-500/10',
    borderClass: 'border-rose-500/20',
  },
  HARD: {
    label: 'Hard',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
  },
  GOOD: {
    label: 'Good',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    borderClass: 'border-blue-500/20',
  },
  EASY: {
    label: 'Easy',
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/20',
  },
};

export const FlashcardProgress = () => {
  const { data, isLoading, isError } = useFlashcardProgress();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm font-medium text-destructive flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Unable to load flashcard progress.</span>
      </div>
    );
  }

  const { totalReviews, results } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Layers className="h-5 w-5 text-indigo-500" />
          <span>Flashcard Review Breakdown</span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          Total Reviews: <span className="font-bold text-foreground">{totalReviews}</span>
        </span>
      </div>

      {/* 4 Results Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {results.map((item) => {
          const cfg = RESULT_CONFIG[item.result] || {
            label: item.result,
            colorClass: 'text-muted-foreground',
            bgClass: 'bg-muted/40',
            borderClass: 'border-border',
          };

          const percentage =
            totalReviews > 0 ? Math.round((item.count / totalReviews) * 100) : 0;

          return (
            <div
              key={item.result}
              className={`rounded-xl border p-4 text-center transition-all ${cfg.borderClass} ${cfg.bgClass}`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${cfg.colorClass}`}>
                {cfg.label}
              </span>
              <p className={`font-display text-2xl font-bold mt-1 ${cfg.colorClass}`}>
                {item.count}
              </p>
              <span className="text-[11px] font-medium text-muted-foreground mt-0.5 block">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
