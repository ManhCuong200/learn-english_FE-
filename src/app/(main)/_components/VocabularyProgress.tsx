'use client';

import { useVocabularyProgress } from '../_hooks/useVocabularyProgress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export const VocabularyProgress = () => {
  const { data, isLoading, isError } = useVocabularyProgress();

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
        <span>Unable to load vocabulary progress.</span>
      </div>
    );
  }

  const { newWords, learningWords, reviewWords, total } = data;
  const safeTotal = Math.max(total, 1);

  const newPercent = Math.round((newWords / safeTotal) * 100);
  const learningPercent = Math.round((learningWords / safeTotal) * 100);
  const reviewPercent = Math.round((reviewWords / safeTotal) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Vocabulary Breakdown</span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          Total: <span className="font-bold text-foreground">{total}</span> words
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded-full bg-secondary overflow-hidden flex">
          {newWords > 0 && (
            <div
              className="bg-slate-400 dark:bg-slate-500 transition-all duration-300"
              style={{ width: `${newPercent}%` }}
              title={`New: ${newWords}`}
            />
          )}
          {learningWords > 0 && (
            <div
              className="bg-blue-500 transition-all duration-300"
              style={{ width: `${learningPercent}%` }}
              title={`Learning: ${learningWords}`}
            />
          )}
          {reviewWords > 0 && (
            <div
              className="bg-emerald-500 transition-all duration-300"
              style={{ width: `${reviewPercent}%` }}
              title={`Review: ${reviewWords}`}
            />
          )}
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            <span>New</span>
          </div>
          <p className="font-display text-xl font-bold text-foreground">{newWords}</p>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-500 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Learning</span>
          </div>
          <p className="font-display text-xl font-bold text-blue-600 dark:text-blue-400">{learningWords}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-500 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Mastered</span>
          </div>
          <p className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">{reviewWords}</p>
        </div>
      </div>
    </div>
  );
};
