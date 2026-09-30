'use client';

import { useProgressOverview } from '@/app/(main)/_hooks/useProgressOverview';
import { ProgressStatCard } from '@/app/(main)/_components/progress/ProgressStatCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Flame,
  CheckCircle2,
  BookOpen,
  Clock,
  Layers,
  Award,
  AlertCircle,
} from 'lucide-react';

export const ProgressOverview = () => {
  const { data, isLoading, isError } = useProgressOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-sm font-medium text-destructive flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Unable to load overview progress data.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressStatCard
          title="Learning Streak"
          value={`${data.learningStreak} ${data.learningStreak === 1 ? 'day' : 'days'}`}
          subtitle="Continuous learning days"
          icon={<Flame className="h-5 w-5 text-amber-500" />}
          accentColor="bg-amber-500/10 text-amber-500"
        />

        <ProgressStatCard
          title="Words Learned"
          value={data.wordsLearned}
          subtitle="Mastered vocabulary"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          accentColor="bg-emerald-500/10 text-emerald-500"
        />

        <ProgressStatCard
          title="In Progress"
          value={data.wordsLearning}
          subtitle="Actively learning"
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          accentColor="bg-blue-500/10 text-blue-500"
        />

        <ProgressStatCard
          title="Due Today"
          value={data.wordsDue}
          subtitle="Ready for review"
          icon={<Clock className="h-5 w-5 text-rose-500" />}
          accentColor="bg-rose-500/10 text-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Flashcard Reviews
              </p>
              <p className="font-display text-2xl font-bold text-foreground mt-0.5">
                {data.flashcardReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quizzes Completed
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-display text-2xl font-bold text-foreground">
                  {data.quizAttempts}
                </span>
                {data.quizAttempts > 0 && (
                  <span className="text-xs font-semibold text-muted-foreground">
                    ({data.averageQuizScore}% avg score)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
