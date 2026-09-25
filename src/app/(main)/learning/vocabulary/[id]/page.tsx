'use client';

import { use, useState } from 'react';
import { useWord } from '../../../_hooks/useWord';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Volume2, BookOpen, LayoutTemplate, Layers, Target, PlayCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ExampleList } from '../../../_components/ExampleList';

import { useExamples } from '../../../_hooks/useExamples';
import { useRecordLearningHistory } from '../../../_hooks/useLearningHistory';
import { toast } from 'sonner';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function WordDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: word, isLoading: isWordLoading, isError } = useWord(id);
  const { data: examplesData, isLoading: isExamplesLoading } = useExamples(id);
  const recordHistory = useRecordLearningHistory();
  const [isMarked, setIsMarked] = useState(false);

  const examples = examplesData || word?.examples || [];

  const handleMarkAsLearned = () => {
    if (!word) return;
    
    recordHistory.mutate({
      type: 'VOCABULARY',
      title: `Learned vocabulary: ${word.word}`,
      description: word.meaning,
      referenceId: word.id,
    }, {
      onSuccess: () => {
        setIsMarked(true);
        toast.success(`You've learned the word "${word.word}"!`);
      },
      onError: () => {
        toast.error('Failed to save learning history.');
      }
    });
  };
  const isLoading = isWordLoading;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-32 rounded-full" />
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="p-8 md:p-12 border-b">
            <Skeleton className="h-16 w-64 mb-4" />
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </div>
          <div className="p-8 md:p-12 space-y-6 bg-muted/20">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !word) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed p-16 text-center bg-card shadow-sm">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <BookOpen className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Word not found</h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            The vocabulary word you are looking for does not exist, has been removed, or could not be loaded.
          </p>
          <Button className="mt-8 rounded-full px-8" onClick={() => window.location.href = '/learning/vocabulary'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Vocabulary
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="mx-auto max-w-4xl p-4 md:p-8 space-y-6">
        <div>
          <Button variant="ghost" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => window.location.href = '/learning/vocabulary'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vocabulary
          </Button>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-white shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Header Section */}
          <div className="relative p-8 md:p-16 border-b bg-gradient-to-br from-background via-background to-primary/5">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-primary/10 blur-[80px]"></div>

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                  {word.word}
                </h1>

                {word.pronunciation && (
                  <div className="flex items-center gap-3">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform hover:scale-110 hover:bg-primary/20 active:scale-95">
                      <Volume2 className="h-6 w-6" />
                    </button>
                    <span className="text-2xl font-mono text-muted-foreground/80 tracking-wide">
                      {word.pronunciation}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {word.level && (
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm font-semibold rounded-full bg-secondary/60">
                    <Target className="mr-2 h-4 w-4 opacity-70" />
                    Level {word.level}
                  </Badge>
                )}
                {word.category && (
                  <Badge variant="outline" className="px-4 py-1.5 text-sm font-semibold rounded-full border-border/60 bg-background/50 backdrop-blur-sm">
                    <Layers className="mr-2 h-4 w-4 opacity-70" />
                    {word.category.name}
                  </Badge>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleMarkAsLearned} 
                  disabled={recordHistory.isPending || isMarked}
                  className={`rounded-full px-6 font-semibold shadow-md transition-all ${
                    isMarked 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' 
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
                  }`}
                >
                  {isMarked ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Learned
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Mark as Learned
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-16 space-y-12 bg-muted/10">
            {/* Meaning Card */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                Meaning
              </h3>
              <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 md:p-8">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 font-medium">
                  {word.meaning}
                </p>
              </div>
            </div>

            {/* Examples Card */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <LayoutTemplate className="h-5 w-5" />
                </div>
                Examples
              </h3>
              <ExampleList examples={examples} isLoading={isExamplesLoading && !word?.examples} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
