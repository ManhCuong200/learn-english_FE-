'use client';

import { use } from 'react';
import { useWord } from '../../_hooks/useWord';
import { useExamples } from '../../_hooks/useExamples';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Volume2, Target, Layers, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';
import { ExampleList } from '../../_components/ExampleList';
import { CreateExampleDialog } from '../../_components/CreateExampleDialog';

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminWordDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: word, isLoading: isWordLoading, isError: isWordError } = useWord(id);
  
  const { data: examplesData, isLoading: isExamplesLoading } = useExamples(id);
  const examples = examplesData || word?.examples || [];

  if (isWordLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isWordError || !word) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Word not found</h2>
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vocabulary
        </Button>
        <Link href={`/learning/vocabulary/${word.id}`}>
          <Button variant="outline" className="text-primary hover:text-primary/80">
            Preview in Learner App
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[60px]"></div>
          <div className="p-8 relative z-10 flex flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {word.word}
              </h1>
              {word.pronunciation && (
                <div className="flex items-center gap-2 text-muted-foreground font-mono">
                  <Volume2 className="h-5 w-5" />
                  <span className="text-lg">{word.pronunciation}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {word.level && (
                <Badge variant="secondary" className="px-3 py-1">
                  <Target className="mr-2 h-3 w-3" /> Level {word.level}
                </Badge>
              )}
              {word.category && (
                <Badge variant="outline" className="px-3 py-1">
                  <Layers className="mr-2 h-3 w-3" /> {word.category.name}
                </Badge>
              )}
            </div>

            <div className="pt-4 border-t border-border/50">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Meaning</h3>
              <p className="text-lg font-medium">{word.meaning}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Examples</h2>
                <p className="text-sm text-muted-foreground">Manage usage examples for this word.</p>
              </div>
            </div>
            <CreateExampleDialog wordId={word.id} />
          </div>
          
          <ExampleList 
            examples={examples} 
            wordId={word.id} 
            isLoading={isExamplesLoading && !word.examples} 
          />
        </div>
      </div>
    </div>
  );
}
