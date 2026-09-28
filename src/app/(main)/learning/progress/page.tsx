'use client';

import { ProgressOverview } from '../../_components/ProgressOverview';
import { ProgressActivityChart } from '../../_components/ProgressActivityChart';
import { VocabularyProgress } from '../../_components/VocabularyProgress';
import { FlashcardProgress } from '../../_components/FlashcardProgress';
import { QuizProgress } from '../../_components/QuizProgress';
import { TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Learning Statistics</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            My Progress
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-2xl">
            Track your vocabulary mastery, daily learning activity, flashcard reviews, and quiz scores.
          </p>
        </div>

        {/* 1. Overview Section */}
        <ProgressOverview />

        {/* 2. Learning Activity Timeline */}
        <ProgressActivityChart />

        {/* 3. Detailed Component Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <VocabularyProgress />
          <FlashcardProgress />
          <QuizProgress />
        </div>
      </div>
    </div>
  );
}
