'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useWords } from '@/app/admin/_hooks/useWords';
import { WordList } from '@/app/admin/_components/words/WordList';
import { WordFilters } from '@/app/admin/_components/words/WordFilters';
import { CreateWordDialog } from '@/app/admin/_components/words/CreateWordDialog';
import { PdfExtractModal } from '@/app/admin/_components/words/PdfExtractModal';
import { Button } from '@/components/ui/button';
import { WordQuery } from '@/types/word';
import { BookA, Sparkles, FileText } from 'lucide-react';

export default function AdminWordsPage() {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const query: WordQuery = {
    search: searchParams.get('search') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    level: searchParams.get('level') || undefined,
  };

  const { data: words, isLoading, isError } = useWords(query);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      
      {/* Dashboard Header Card */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]"></div>
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookA className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Vocabulary Management</h2>
              <p className="text-muted-foreground mt-1">
                Manage all your English vocabulary words, meanings, and categories in one place.
              </p>
            </div>
          </div>
          <div className="shrink-0 mt-4 sm:mt-0 flex items-center gap-3 flex-wrap">
            <Button
              onClick={() => setIsPdfModalOpen(true)}
              className="rounded-xl gap-2 font-semibold shadow-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
            >
              <Sparkles className="size-4" />
              <FileText className="size-4" />
              Trích xuất từ PDF (AI)
            </Button>
            <CreateWordDialog />
          </div>
        </div>
      </div>

      <PdfExtractModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries();
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <WordFilters />
        </div>
        
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          {isError ? (
            <div className="p-12 text-center flex flex-col items-center justify-center border-t">
              <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <BookA className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-medium text-destructive">Failed to load words</h3>
              <p className="text-sm text-muted-foreground mt-1">Please check your connection and try again.</p>
            </div>
          ) : (
            <WordList words={words} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
