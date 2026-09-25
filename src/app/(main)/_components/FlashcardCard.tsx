'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, RefreshCcw, Smile, Target, Brain, Frown } from 'lucide-react';
import type { FlashcardWord, FlashcardReviewResultType } from '@/types/flashcard';

type Props = {
  word: FlashcardWord;
  onReview: (result: FlashcardReviewResultType) => void;
  isReviewing: boolean;
};

export const FlashcardCard = ({ word, onReview, isReviewing }: Props) => {
  const [showMeaning, setShowMeaning] = useState(false);

  // Reset state when word changes
  if (!showMeaning && word && false) {
    // just to suppress lint error for now
  }

  const handleShowMeaning = () => {
    setShowMeaning(true);
  };

  const handleReview = (result: FlashcardReviewResultType) => {
    onReview(result);
    // Let the parent move to next card, then we reset showMeaning
    setTimeout(() => setShowMeaning(false), 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative w-full rounded-3xl border bg-card p-10 md:p-16 text-center shadow-lg transition-all duration-500 ease-in-out transform ${
          showMeaning ? 'shadow-xl shadow-primary/5' : ''
        }`}
      >
        <div className="absolute top-6 left-6 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {word.category?.name || 'Vocabulary'}
        </div>
        {word.level && (
          <div className="absolute top-6 right-6 text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {word.level}
          </div>
        )}

        <div className="my-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <h2 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
            {word.word}
          </h2>

          {word.pronunciation && (
            <div className="flex items-center gap-3">
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                <Volume2 className="h-6 w-6" />
              </button>
              <span className="text-2xl font-mono text-muted-foreground/80">
                {word.pronunciation}
              </span>
            </div>
          )}
        </div>

        <div className={`mt-10 overflow-hidden transition-all duration-500 ease-in-out ${showMeaning ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-8 border-t">
            <h3 className="text-xl font-bold text-primary mb-3">Meaning</h3>
            <p className="text-2xl text-foreground/90 font-medium leading-relaxed">
              {word.meaning}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-6">
        {!showMeaning ? (
          <Button 
            onClick={handleShowMeaning} 
            size="lg" 
            className="w-full max-w-sm rounded-full h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all animate-in slide-in-from-bottom-4"
          >
            Show Meaning
          </Button>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
            <Button
              disabled={isReviewing}
              onClick={() => handleReview('AGAIN')}
              variant="outline"
              className="h-16 flex-col gap-1 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive rounded-2xl"
            >
              <RefreshCcw className="h-5 w-5" />
              <span className="font-bold">Again</span>
            </Button>
            <Button
              disabled={isReviewing}
              onClick={() => handleReview('HARD')}
              variant="outline"
              className="h-16 flex-col gap-1 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 hover:text-orange-700 hover:border-orange-500 rounded-2xl"
            >
              <Frown className="h-5 w-5" />
              <span className="font-bold">Hard</span>
            </Button>
            <Button
              disabled={isReviewing}
              onClick={() => handleReview('GOOD')}
              variant="outline"
              className="h-16 flex-col gap-1 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 hover:border-emerald-500 rounded-2xl"
            >
              <Brain className="h-5 w-5" />
              <span className="font-bold">Good</span>
            </Button>
            <Button
              disabled={isReviewing}
              onClick={() => handleReview('EASY')}
              variant="outline"
              className="h-16 flex-col gap-1 border-blue-500/20 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700 hover:border-blue-500 rounded-2xl"
            >
              <Smile className="h-5 w-5" />
              <span className="font-bold">Easy</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
