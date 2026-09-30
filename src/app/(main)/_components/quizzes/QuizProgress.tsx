'use client';

import { useQuizProgress } from '@/app/(main)/_hooks/useQuizProgress';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Trophy, Target, AlertCircle } from 'lucide-react';

export const QuizProgress = () => {
  const { data, isLoading, isError } = useQuizProgress();

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
        <span>Unable to load quiz statistics.</span>
      </div>
    );
  }

  const { attempts, averageScore, bestScore } = data;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Award className="h-5 w-5 text-violet-500" />
          <span>Quiz Performance</span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          Completed: <span className="font-bold text-foreground">{attempts}</span> quizzes
        </span>
      </div>

      {/* 3 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Quiz Attempts
            </span>
            <span className="font-display text-2xl font-bold text-foreground">
              {attempts}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Average Score
            </span>
            <span className="font-display text-2xl font-bold text-blue-600 dark:text-blue-400">
              {averageScore}%
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Best Score
            </span>
            <span className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {bestScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
