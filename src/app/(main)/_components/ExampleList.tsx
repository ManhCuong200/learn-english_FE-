'use client';

import { Example } from '@/types/example';
import { PlayCircle, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type LearnerExampleListProps = {
  examples?: Example[];
  isLoading?: boolean;
};

export const ExampleList = ({ examples, isLoading }: LearnerExampleListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  if (!examples || examples.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed bg-card/50">
        <Quote className="h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-muted-foreground">No examples available for this word.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {examples.map((example, index) => (
        <div 
          key={example.id} 
          className="group relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8 transition-all hover:border-emerald-500/30 hover:shadow-md"
        >
          <div className="absolute top-6 right-6 opacity-0 transition-opacity group-hover:opacity-100">
            <PlayCircle className="h-6 w-6 text-emerald-500/40" />
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
              {index + 1}
            </div>
            <div className="space-y-2">
              <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                "{example.content}"
              </p>
              {example.meaning && (
                <p className="text-base md:text-lg text-muted-foreground">
                  {example.meaning}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
