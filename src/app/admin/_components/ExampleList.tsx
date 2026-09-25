'use client';

import { Example } from '@/types/example';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit2, Trash2, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditExampleDialog } from './EditExampleDialog';
import { DeleteExampleDialog } from './DeleteExampleDialog';

type ExampleListProps = {
  examples?: Example[];
  wordId: string;
  isLoading: boolean;
};

export const ExampleList = ({ examples, wordId, isLoading }: ExampleListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (!examples || examples.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed bg-muted/30">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Quote className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">
          No examples yet. Add an example to help learners understand this word.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {examples.map((example, index) => (
        <div key={example.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-sm hover:border-primary/20">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
              {index + 1}
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">{example.content}</p>
              {example.meaning && (
                <p className="text-sm text-muted-foreground">{example.meaning}</p>
              )}
            </div>
          </div>
          <div className="flex sm:shrink-0 justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <EditExampleDialog example={example} wordId={wordId}>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Edit2 className="mr-2 h-3 w-3" />
                Edit
              </Button>
            </EditExampleDialog>
            <DeleteExampleDialog example={example} wordId={wordId}>
              <Button variant="outline" size="sm" className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-transparent sm:border-border">
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </Button>
            </DeleteExampleDialog>
          </div>
        </div>
      ))}
    </div>
  );
};
