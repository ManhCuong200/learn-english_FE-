'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Layers, Target, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Word } from '@/types/word';
import { EditWordDialog } from './EditWordDialog';
import { DeleteWordDialog } from './DeleteWordDialog';

type WordListProps = {
  words?: Word[];
  isLoading: boolean;
};

export const WordList = ({ words, isLoading }: WordListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex gap-4 border-b pb-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="rounded-full bg-muted/50 p-6 mb-4">
          <Layers className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold">No vocabulary found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your vocabulary list is empty. Add your first word to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-foreground w-[250px]">Word</TableHead>
            <TableHead className="font-semibold text-foreground max-w-[300px]">Meaning</TableHead>
            <TableHead className="font-semibold text-foreground w-[150px]">Level</TableHead>
            <TableHead className="font-semibold text-foreground w-[200px]">Category</TableHead>
            <TableHead className="font-semibold text-foreground text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {words.map((word) => (
            <TableRow key={word.id} className="group transition-colors hover:bg-muted/40">
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {word.word}
                  </span>
                  {word.pronunciation && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                      <Volume2 className="h-3 w-3 opacity-50" />
                      {word.pronunciation}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="max-w-[300px]">
                <p className="truncate text-foreground/80 font-medium" title={word.meaning}>
                  {word.meaning}
                </p>
              </TableCell>
              
              <TableCell>
                {word.level ? (
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-transparent shadow-none font-semibold">
                    <Target className="mr-1 h-3 w-3" />
                    {word.level}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground/50 text-sm italic">Unassigned</span>
                )}
              </TableCell>
              
              <TableCell>
                {word.category?.name ? (
                  <Badge variant="outline" className="bg-background/50 border-muted-foreground/20 text-muted-foreground font-medium shadow-none">
                    <Layers className="mr-1 h-3 w-3 opacity-60" />
                    {word.category.name}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground/50 text-sm italic">Unassigned</span>
                )}
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  <EditWordDialog word={word}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </EditWordDialog>
                  
                  <DeleteWordDialog word={word}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DeleteWordDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
