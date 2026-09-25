'use client';

import { useState } from 'react';
import { useFlashcards, useReviewFlashcard } from '../_hooks/useFlashcard';
import { FlashcardCard } from './FlashcardCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, Trophy, ArrowRight, Loader2 } from 'lucide-react';
import type { FlashcardReviewResultType } from '@/types/flashcard';
import { toast } from 'sonner';

export const FlashcardSession = () => {
  const { data, isLoading, isError, refetch } = useFlashcards(10);
  const reviewMutation = useReviewFlashcard();

  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = data?.data || [];
  const isFinished = currentIndex >= cards.length && cards.length > 0;
  const currentCard = cards[currentIndex];

  const handleReview = (result: FlashcardReviewResultType) => {
    if (!currentCard) return;

    reviewMutation.mutate(
      { wordId: currentCard.id, payload: { result } },
      {
        onSuccess: () => {
          setCurrentIndex((prev) => prev + 1);
        },
        onError: () => {
          toast.error('Failed to save review result. Please try again.');
        },
      }
    );
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center animate-pulse">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <Skeleton className="h-14 w-64 rounded-full mt-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-12 rounded-3xl border border-destructive/20 bg-destructive/5">
        <p className="text-xl font-bold text-destructive mb-4">Oops! Failed to load flashcards.</p>
        <Button onClick={() => refetch()} variant="outline" className="rounded-full">Try again</Button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-16 rounded-3xl border border-dashed bg-card/50 shadow-sm">
        <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold mb-3">No flashcards available</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          You don&apos;t have any vocabulary to review right now. Add some new words or check back later!
        </p>
        <Button onClick={() => window.location.href = '/learning/vocabulary'} size="lg" className="rounded-full px-8">
          Explore Vocabulary <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="w-full max-w-xl mx-auto text-center p-16 rounded-3xl border bg-gradient-to-br from-card to-emerald-500/5 shadow-xl animate-in zoom-in-95 duration-500">
        <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-75"></div>
          <Trophy className="w-12 h-12 text-emerald-500 relative z-10" />
        </div>
        <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
          Session Complete!
        </h2>
        <p className="text-xl text-muted-foreground mb-10 font-medium">
          Awesome job! You&apos;ve reviewed {cards.length} flashcards today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => window.location.href = '/learning'} variant="outline" size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 font-bold text-base border-border/60 hover:bg-muted">
            Back to Home
          </Button>
          <Button onClick={handleRestart} size="lg" className="rounded-full w-full sm:w-auto h-14 px-8 font-bold text-base shadow-lg shadow-primary/20">
            Review More <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Progress bar */}
      <div className="absolute -top-12 left-0 right-0 max-w-md mx-auto">
        <div className="flex items-center justify-between text-sm font-bold text-muted-foreground mb-2 px-2">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span>{Math.round((currentIndex / cards.length) * 100)}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${(currentIndex / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <FlashcardCard 
        word={currentCard} 
        onReview={handleReview} 
        isReviewing={reviewMutation.isPending} 
      />
    </div>
  );
};
