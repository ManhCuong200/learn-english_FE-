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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background pt-16 md:pt-24 pb-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 -translate-y-12 translate-x-1/3 right-0 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="mr-2 h-4 w-4" />
            Discover new words
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Expand Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Vocabulary</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Master English with our curated collection of words. Search, filter, and learn with detailed meanings and real-world examples.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Glassmorphic Filters */}
        <div className="rounded-2xl border bg-background/60 backdrop-blur-xl p-4 md:p-6 shadow-xl shadow-black/5 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <WordFilters />
        </div>

        {/* Content Area */}
        <div className="mt-12">
          {isError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
              <p className="text-lg font-medium">Failed to load vocabulary.</p>
              <p className="text-sm opacity-80 mt-1">Please check your connection and try again.</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-1000 delay-500">
              <WordList words={words} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
