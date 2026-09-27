'use client';

import { QuizSession } from '../../_components/QuizSession';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-8">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">Knowledge Test</p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
          Quiz Practice
        </h1>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <QuizSession />
      </div>
    </div>
  );
}
