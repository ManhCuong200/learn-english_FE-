'use client';

import { useState } from 'react';
import { useQuizzes } from '../../_hooks/useQuizzes';
import { QuizFilters } from '@/app/(main)/_components/quizzes/QuizFilters';
import { QuizList } from '@/app/(main)/_components/quizzes/QuizList';
import { HelpCircle } from 'lucide-react';

export default function QuizzesPage() {
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuizzes({ categoryId, level });

  const handleResetFilters = () => {
    setCategoryId(undefined);
    setLevel(undefined);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase mb-1">
            <HelpCircle className="h-4 w-4" />
            <span>Vocabulary Assessment</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Quizzes
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Test your vocabulary and track your progress with our structured quizzes.
          </p>
        </div>

        {/* Filters */}
        <QuizFilters
          selectedCategoryId={categoryId}
          selectedLevel={level}
          onCategoryChange={setCategoryId}
          onLevelChange={setLevel}
          onReset={handleResetFilters}
        />

        {/* Quiz List */}
        <QuizList
          quizzes={data?.data}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          onClearFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}
