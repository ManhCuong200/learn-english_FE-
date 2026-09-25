'use client';

import { useSearchParams } from 'next/navigation';
import { useWords } from '../../_hooks/useWords';
import { WordList } from '../../_components/WordList';
import { WordFilters } from '../../_components/WordFilters';
import { WordQuery } from '@/types/word';
import { Sparkles } from 'lucide-react';

export default function VocabularyPage() {
  const searchParams = useSearchParams();

  const query: WordQuery = {
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    level: searchParams.get('level') || undefined,
  };

  const { data: words, isLoading, isError } = useWords(query);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">Discover</p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
          Vocabulary
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="mb-8 rounded-[1.5rem] border border-border/50 bg-card p-6 shadow-sm">
          <WordFilters />
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {isError ? (
            <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-8 text-center text-rose-600">
              <p className="text-lg font-bold">Failed to load vocabulary.</p>
              <p className="text-sm opacity-80 mt-1 font-medium">Please check your connection and try again.</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000 delay-150">
              <WordList words={words} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
