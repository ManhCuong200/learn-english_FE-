'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LearningHistoryMeta } from '@/types/learning-history';

type LearningHistoryPaginationProps = {
  meta: LearningHistoryMeta;
};

export const LearningHistoryPagination = ({ meta }: LearningHistoryPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: true });
  };

  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t">
      <div className="text-sm text-muted-foreground hidden sm:block">
        Showing page <span className="font-medium text-foreground">{meta.page}</span> of{' '}
        <span className="font-medium text-foreground">{meta.totalPages}</span>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="text-sm font-medium sm:hidden">
          {meta.page} / {meta.totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="gap-1.5"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
